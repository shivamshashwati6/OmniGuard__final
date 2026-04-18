/**
 * OmniGuard Backend — Real-time Sync Service
 * Bridges Firestore onSnapshot changes to WebSocket broadcasts.
 * Ensures all connected clients receive live incident updates
 * regardless of which API endpoint triggered the change.
 */

const { subscribeToIncidents, listResponders } = require('./firestoreService');
const { getTeamStats, getGlobalStats } = require('./statsService');
const { calculateDistance } = require('./locationUtils');

const notifiedNearbyIncidents = new Set();

/**
 * Start real-time Firestore → WebSocket synchronization.
 * Subscribes to incident collection changes and pipes them into
 * the WebSocket broadcast system.
 *
 * @param {object} wsService - WebSocket service (from wsService.js)
 * @param {import('winston').Logger} logger - Winston logger
 * @returns {Function} Unsubscribe function to stop the listener
 */
function startRealtimeSync(wsService, logger) {
  logger.info('Starting Firestore → WebSocket real-time sync...');

  const incidentUnsub = subscribeToIncidents((changeType, incidentData) => {
    // ... existing incident sync logic ...
    // Map Firestore change types to WebSocket events
    const eventMap = {
      added: 'INCIDENT_CREATED',
      modified: 'INCIDENT_UPDATED',
      removed: 'INCIDENT_DELETED',
    };

    const event = eventMap[changeType];
    if (!event) return;

    // Check if this is an SOS activation
    if (changeType === 'modified' && incidentData.sosActive) {
      wsService.broadcast('SOS_TRIGGERED', {
        incidentId: incidentData.id,
        incidentNumber: incidentData.incidentNumber,
        type: incidentData.type,
        location: incidentData.location,
        source: 'firestore-sync',
      });
    }

    // Check if the incident was closed
    if (changeType === 'modified' && incidentData.status === 'Closed') {
      if (incidentData.assignedTeam) {
        wsService.broadcastToTeam(incidentData.assignedTeam, 'INCIDENT_CLOSED', {
          incidentId: incidentData.id,
          assignedTeam: incidentData.assignedTeam,
          source: 'firestore-sync',
        });
      }
    }

    // Check for NEW_INCIDENT_NEARBY: Push to responders within 5km when an incident becomes active
    const activeStatuses = ['Reported', 'Triaged', 'Dispatching'];
    if ((changeType === 'added' || changeType === 'modified') && activeStatuses.includes(incidentData.status) && incidentData.assignedTeam && incidentData.location?.coordinates) {
      if (!notifiedNearbyIncidents.has(incidentData.id)) {
        notifiedNearbyIncidents.add(incidentData.id);

        listResponders({ teamType: incidentData.assignedTeam }).then(responders => {
          responders.forEach(responder => {
            if (responder.currentPosition) {
              const distance = calculateDistance(incidentData.location.coordinates, responder.currentPosition);
              if (distance !== null && distance <= 5) {
                wsService.sendToUser(responder.id, 'NEW_INCIDENT_NEARBY', {
                  incidentId: incidentData.id,
                  incidentNumber: incidentData.incidentNumber,
                  type: incidentData.type,
                  severity: incidentData.severity,
                  distance: parseFloat(distance.toFixed(2)),
                  source: 'firestore-sync'
                });
              }
            }
          });
        }).catch(err => logger.error('Failed to push NEW_INCIDENT_NEARBY:', err));
      }
    }

    // Emit team stats whenever an incident is added, modified, or removed
    if (incidentData.assignedTeam) {
      getTeamStats(incidentData.assignedTeam).then(stats => {
        wsService.broadcastToTeam(incidentData.assignedTeam, 'TEAM_STATS_UPDATED', {
          teamId: incidentData.assignedTeam,
          stats,
          source: 'firestore-sync'
        });
      }).catch(err => {
        logger.error(`Failed to update team stats for ${incidentData.assignedTeam}:`, err);
      });
    }

    // Always emit global stats for admins/coordinators on any change
    getGlobalStats().then(stats => {
      wsService.broadcastToRole('coordinator', 'GLOBAL_STATS_UPDATED', {
        stats,
        source: 'firestore-sync'
      });
      wsService.broadcastToRole('admin', 'GLOBAL_STATS_UPDATED', {
        stats,
        source: 'firestore-sync'
      });
    }).catch(err => {
      logger.error('Failed to update global stats:', err);
    });

    // Broadcast the change
    // Deleted events go to coordinators only.
    if (changeType === 'removed') {
      wsService.broadcastToRole('coordinator', event, {
        incidentId: incidentData.id,
        changeType,
        source: 'firestore-sync',
      });
    } else {
      // Only call broadcastToTeam(teamId, data) as requested, avoiding a global broadcast
      if (incidentData.assignedTeam) {
        wsService.broadcastToTeam(incidentData.assignedTeam, event, {
          incident: incidentData,
          changeType,
          source: 'firestore-sync',
        });
      } else {
        // Fallback for incidents without an assigned team
        wsService.broadcast(event, {
          incident: incidentData,
          changeType,
          source: 'firestore-sync',
        });
      }
    }

    logger.debug(`Firestore sync: ${event}`, {
      incidentId: incidentData.id,
      changeType,
    });
  });

  // Sync Responder Locations (Live Assets)
  const { subscribeToResponders } = require('./firestoreService');
  const responderUnsub = subscribeToResponders((changeType, responderData) => {
    if (changeType === 'modified' && responderData.currentPosition) {
      wsService.broadcastToRole('coordinator', 'RESPONDER_LOCATION_UPDATE', {
        responderId: responderData.id,
        name: responderData.name,
        lat: responderData.currentPosition.lat,
        lng: responderData.currentPosition.lng,
        updatedAt: responderData.currentPosition.updatedAt,
        source: 'firestore-sync',
      });
    }
  });

  logger.info('✔ Firestore real-time sync active (Incidents + Responders)');

  return () => {
    incidentUnsub();
    responderUnsub();
  };
}

module.exports = { startRealtimeSync };
