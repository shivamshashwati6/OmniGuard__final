require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  console.log('Mock movement simulation is disabled in production.');
  process.exit(0);
}
const { initFirebase, getDb } = require('../config/firebase');
const { COLLECTIONS } = require('../services/firestoreService');
const { calculateDistance } = require('../services/locationUtils');
const { triageIncident } = require('../services/triageService');
const { createLogger } = require('../utils/logger');

const GU_LOCATION = { lat: 26.1558, lng: 91.6622 };

async function run() {
  const env = { ...process.env, LOG_LEVEL: 'error' };
  initFirebase(env);
  const db = getDb();
  const logger = createLogger(env);

  console.log('Simulating Duress Trigger at Gauhati University...');
  
  // Create incident
  const incidentData = {
    type: 'Campus Duress Alarm',
    location: {
      sector: 'Gauhati University',
      coordinates: GU_LOCATION
    },
    status: 'Reported',
    createdAt: new Date(),
    softDeleted: false
  };
  
  const incidentRef = await db.collection(COLLECTIONS.INCIDENTS).add(incidentData);
  console.log('Created Duress Incident:', incidentRef.id);
  
  // Triage it to get assignedTeam
  const triageRes = await triageIncident({
    incidentId: incidentRef.id,
    type: incidentData.type,
    location: incidentData.location,
    reportedBy: { role: 'system', name: 'Simulator' }
  }, env, logger);
  
  const assignedTeam = triageRes.result.assignedTeam;
  const modelUsed = triageRes.model;
  console.log(`Assigned Team by ${modelUsed}:`, assignedTeam);
  
  // Update incident with triage
  await db.collection(COLLECTIONS.INCIDENTS).doc(incidentRef.id).update({
    status: 'active',
    assignedTeam: assignedTeam,
    severity: triageRes.result.severity
  });

  console.log('\nStarting Patrol Simulation...');

  // Get all mock responders
  const snapshot = await db.collection(COLLECTIONS.RESPONDERS).where('status', '==', 'active').get();
  let responders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  
  if (responders.length === 0) {
    console.log('No responders found! Run node scripts/seed-responders.js first.');
    process.exit(1);
  }

  setInterval(async () => {
    console.clear();
    console.log(`--- Real-time Simulation Table ---`);
    console.log(`Incident: Duress at GU | Target Team: ${assignedTeam}`);
    console.log('-----------------------------------------------------------------------------------');
    console.log('| Responder Name         | Team        | Distance to GU (km) | Is Notified (Y/N) |');
    console.log('-----------------------------------------------------------------------------------');
    
    // Batch updates for performance
    const batch = db.batch();

    for (let r of responders) {
      // Jitter +/- 0.0002
      const dLat = (Math.random() - 0.5) * 0.0004;
      const dLng = (Math.random() - 0.5) * 0.0004;
      
      r.currentPosition.lat += dLat;
      r.currentPosition.lng += dLng;
      
      const docRef = db.collection(COLLECTIONS.RESPONDERS).doc(r.id);
      batch.update(docRef, {
        currentPosition: r.currentPosition,
        updatedAt: new Date()
      });
      
      // Distance to GU
      const dist = calculateDistance(r.currentPosition, GU_LOCATION);
      
      // Notification Logic: <= 5km AND correct team
      const isNotified = (dist !== null && dist <= 5 && r.teamType === assignedTeam) ? 'Y' : 'N';
      
      const name = r.name.padEnd(22);
      const team = r.teamType.padEnd(11);
      const distStr = (dist !== null ? dist.toFixed(2) : 'N/A').padEnd(19);
      const notif = isNotified.padEnd(17);
      
      console.log(`| ${name} | ${team} | ${distStr} | ${notif} |`);
    }
    
    await batch.commit();
    console.log('-----------------------------------------------------------------------------------');
    
  }, 3000);
}

run().catch(console.error);
