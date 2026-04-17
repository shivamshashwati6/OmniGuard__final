# OmniGuard__backend

## Testing & QA

To facilitate manual testing and validation of the Role-Based Access Control (RBAC) and Geospatial Triage systems, several mock accounts have been seeded into the database.

### Mock Credentials

| Role | Team | Username/Email | Password (default) |
| :--- | :--- | :--- | :--- |
| Admin | All | `admin@omniguard.test` | `OmniTest2026!` |
| Responder | Fire | `fire_lead@omniguard.test` | `FirePass123` |
| Responder | Medical | `med_unit1@omniguard.test` | `MedPass123` |

*Note: You can re-seed these credentials at any time by running `npm run node server/scripts/seed-users.js`.*

### Testing the 5km Geospatial Triage Logic

The system is equipped with an automated geospatial triage engine. When a new incident is reported, the backend uses the Haversine formula to identify all active responders matching the AI-assigned incident type. 

**Only responders within a strict 5.0 km radius** of the incident coordinates will receive the high-priority `NEW_INCIDENT_NEARBY` WebSocket broadcast.

#### How to Simulate a "Scream" Event
To manually verify this functionality without using the frontend UI, you can use the integrated Digital Twin Simulation script. This script mocks a "Duress Trigger" (Scream event) at the center of Gauhati University (Coordinates: `26.1558, 91.6622`) and simulates live patrol movements.

Run the simulation from the `server/` directory:
```bash
node scripts/simulate-movement.js
```

**Expected Behavior:**
1. The script triggers a new incident and passes the context to the Gemini AI.
2. Gemini classifies the event as a `Police` priority.
3. The script continuously logs a live console table jittering the mock responders' locations.
4. Only responders assigned to the `Police` team **AND** currently $< 5.0$ km from Gauhati University will be flagged as `Is Notified: Y`.
