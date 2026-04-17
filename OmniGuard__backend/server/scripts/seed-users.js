/**
 * OmniGuard Backend — Firestore User Seed Script
 * Creates initial test users for all three roles (coordinator, responder, civilian).
 * Run once: node scripts/seed-users.js
 *
 * Passwords are SHA-256 hashed (matching authController.js prototype logic).
 */

require('dotenv').config();

const crypto = require('crypto');
const { loadEnv } = require('../config/env');
const { initFirebase, getDb } = require('../config/firebase');

if (process.env.NODE_ENV === 'production') {
  console.log('Safety Abort: Database seeding is disabled in production environments.');
  process.exit(1);
}

const USERS = [
  {
    email: 'admin@omniguard.test',
    name: 'Test Admin',
    role: 'coordinator',
    password: 'OmniTest2026!',
    nodeId: 'NODE-ADMIN-1',
  },
  {
    email: 'fire_lead@omniguard.test',
    name: 'Fire Lead Unit',
    role: 'responder',
    password: 'FirePass123',
    assignedTeam: 'Fire',
    nodeId: 'NODE-FIRE-1',
  },
  {
    email: 'med_unit1@omniguard.test',
    name: 'Medical Unit 1',
    role: 'responder',
    password: 'MedPass123',
    assignedTeam: 'Medical',
    nodeId: 'NODE-MED-1',
  },
];

// Mock responders for geospatial display
const RESPONDERS = [
  {
    name: 'SDRF Alpha Team',
    teamType: 'Medical',
    status: 'Available',
    userId: null, // Will be linked to responder1
    currentPosition: { lat: 26.1600, lng: 91.7500, updatedAt: new Date() },
  },
  {
    name: 'Dibrugarh Response Unit',
    teamType: 'Security',
    status: 'Available',
    userId: null,
    currentPosition: { lat: 27.4800, lng: 94.9200, updatedAt: new Date() },
  },
  {
    name: 'Tezpur Fire Brigade',
    teamType: 'Fire',
    status: 'Available',
    userId: null,
    currentPosition: { lat: 26.6338, lng: 92.7926, updatedAt: new Date() },
  },
];

async function seed() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   OmniGuard — Seeding Firestore Users    ║');
  console.log('╚══════════════════════════════════════════╝');

  const env = loadEnv();
  initFirebase(env);
  const db = getDb();

  // Seed users
  console.log('\n── Seeding Users ──');
  for (const userData of USERS) {
    const { password, ...rest } = userData;
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const doc = {
      ...rest,
      passwordHash,
      isActive: true,
      createdAt: new Date(),
      lastSeen: new Date(),
    };

    // Use email as a deterministic ID for idempotency
    const docId = userData.email.replace(/[@.]/g, '_');
    await db.collection('users').doc(docId).set(doc, { merge: true });
    console.log(`  ✔ ${userData.role.padEnd(12)} ${userData.email} (pass: ${password})`);
  }

  // Seed responders
  console.log('\n── Seeding Responders ──');
  for (let i = 0; i < RESPONDERS.length; i++) {
    const resp = { ...RESPONDERS[i] };
    const docId = `resp-${i + 1}`;
    await db.collection('responders').doc(docId).set(resp, { merge: true });
    console.log(`  ✔ ${resp.name} (${resp.teamType})`);
  }

  console.log('\n✔ Seed complete. Test credentials:');
  console.log('  admin@omniguard.test       / OmniTest2026!');
  console.log('  fire_lead@omniguard.test   / FirePass123');
  console.log('  med_unit1@omniguard.test   / MedPass123');
  console.log('');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
