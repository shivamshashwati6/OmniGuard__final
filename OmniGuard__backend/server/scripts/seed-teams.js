/**
 * OmniGuard Backend — Teams Seeding Script
 * Creates responder users with the responderTeam field for Fire, Medical, Police, and Tech-Hazard.
 */

require('dotenv').config();

const crypto = require('crypto');
const { loadEnv } = require('../config/env');
const { initFirebase, getDb } = require('../config/firebase');

if (process.env.NODE_ENV === 'production') {
  console.log('Safety Abort: Database seeding is disabled in production environments.');
  process.exit(1);
}

const TEAMS = ['Fire', 'Medical', 'Police', 'Tech-Hazard'];

const TEAM_USERS = TEAMS.map(team => ({
  email: `${team.toLowerCase()}@omniguard.io`,
  name: `${team} Responder Lead`,
  role: 'responder',
  responderTeam: team,
  password: `${team.toLowerCase()}2024!`,
  nodeId: `NODE-${team.toUpperCase()}-1`,
}));

async function seedTeams() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   OmniGuard — Seeding Team Responders    ║');
  console.log('╚══════════════════════════════════════════╝');

  const env = loadEnv();
  initFirebase(env);
  const db = getDb();

  console.log('\n── Seeding Team Users ──');
  for (const userData of TEAM_USERS) {
    const { password, ...rest } = userData;
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const doc = {
      ...rest,
      passwordHash,
      isActive: true,
      createdAt: new Date(),
      lastSeen: new Date(),
    };

    const docId = userData.email.replace(/[@.]/g, '_');
    await db.collection('users').doc(docId).set(doc, { merge: true });
    console.log(`  ✔ ${userData.responderTeam.padEnd(12)} ${userData.email} (pass: ${password})`);
  }

  console.log('\n✔ Team Seed complete.');
  process.exit(0);
}

seedTeams().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
