const { getDb } = require('../config/firebase');

const COLLECTIONS = {
  INCIDENTS: 'incidents',
};

const ACTIVE_STATUSES = ['active', 'Reported', 'Triaged', 'Dispatching', 'En Route', 'On Scene'];
const CLOSED_STATUSES = ['closed', 'Closed', 'Resolved'];

/**
 * Calculates Active and Closed incident counts based on user role.
 * If Responder -> returns counts only for their assignedTeam.
 * If Admin/Coordinator -> returns global counts across all teams.
 * 
 * @param {object} user - The authenticated user object from req.user
 * @returns {Promise<{active: number, closed: number}>}
 */
async function getIncidentStats(user) {
  const db = getDb();
  let baseQuery = db.collection(COLLECTIONS.INCIDENTS).where('softDeleted', '==', false);

  if (user && user.role === 'responder') {
    const teamId = user.assignedTeam || user.responderTeam;
    if (teamId) {
      baseQuery = baseQuery.where('assignedTeam', '==', teamId);
    }
  }

  // Using simple queries assuming index exists. If 'in' operator fails due to missing index,
  // we would need to map/filter in memory, but 'in' is supported in Firestore.
  const activeSnapshot = await baseQuery.where('status', 'in', ACTIVE_STATUSES).select().get();
  const closedSnapshot = await baseQuery.where('status', 'in', CLOSED_STATUSES).select().get();

  return {
    active: activeSnapshot.size,
    closed: closedSnapshot.size
  };
}

/**
 * Global stats calculator for WebSocket broadcast
 */
async function getGlobalStats() {
  const db = getDb();
  const baseQuery = db.collection(COLLECTIONS.INCIDENTS).where('softDeleted', '==', false);
  const activeSnapshot = await baseQuery.where('status', 'in', ACTIVE_STATUSES).select().get();
  const closedSnapshot = await baseQuery.where('status', 'in', CLOSED_STATUSES).select().get();
  
  return {
    active: activeSnapshot.size,
    closed: closedSnapshot.size
  };
}

/**
 * Team-specific stats calculator for WebSocket broadcast
 */
async function getTeamStats(teamId) {
  const db = getDb();
  const baseQuery = db.collection(COLLECTIONS.INCIDENTS)
    .where('softDeleted', '==', false)
    .where('assignedTeam', '==', teamId);
    
  const activeSnapshot = await baseQuery.where('status', 'in', ACTIVE_STATUSES).select().get();
  const closedSnapshot = await baseQuery.where('status', 'in', CLOSED_STATUSES).select().get();
  
  return {
    active: activeSnapshot.size,
    closed: closedSnapshot.size
  };
}

module.exports = {
  getIncidentStats,
  getGlobalStats,
  getTeamStats
};
