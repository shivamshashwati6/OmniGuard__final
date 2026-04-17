require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  console.log('Safety Abort: Database seeding is disabled in production environments.');
  process.exit(1);
}
const { initFirebase, getDb } = require('../config/firebase');
const { COLLECTIONS } = require('../services/firestoreService');

const TEAMS = ['Fire', 'Medical', 'Police', 'Tech-Hazard'];
const CENTER = { lat: 26.1445, lng: 91.7362 };

function getRandomOffset() {
  // ~5km radius roughly equals 0.045 degrees
  const r = 5 / 111.3;
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  // Adjust x for longitude shrinking (Guwahati is at ~26 deg lat)
  const xAdjusted = x / Math.cos(CENTER.lat * Math.PI / 180);
  
  return { dLat: y, dLng: xAdjusted };
}

async function run() {
  initFirebase(process.env);
  const db = getDb();
  
  console.log('Seeding mock responders...');
  
  let count = 0;
  for (const team of TEAMS) {
    for (let i = 1; i <= 5; i++) {
      const offset = getRandomOffset();
      const responder = {
        name: `Mock ${team} Responder ${i}`,
        teamType: team,
        status: 'active',
        currentPosition: {
          lat: CENTER.lat + offset.dLat,
          lng: CENTER.lng + offset.dLng,
          updatedAt: new Date(),
        },
      };
      
      const docRef = await db.collection(COLLECTIONS.RESPONDERS).add(responder);
      console.log(`Created [${team}] ${docRef.id}`);
      count++;
    }
  }
  console.log(`Seeded ${count} responders successfully.`);
  process.exit(0);
}

run().catch(console.error);
