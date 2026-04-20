---
title: OmniGuard-API
emoji: 🛡️
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# OmniGuard — Crisis Management System 🚨

OmniGuard is an industrial-grade, real-time crisis management platform designed for the hospitality and industrial sectors. It enables rapid incident reporting, automated AI-driven triage, and seamless dispatcher coordination using geospatial tracking.

## 🚀 Live Deployments

| Component | Status | Link |
| :--- | :--- | :--- |
| **Tactical Dashboard** | 🟢 Production | [omniguard-web.vercel.app](https://omniguard-web.vercel.app) |
| **System API (WS/REST)** | 🟢 Operational | [OmniGuard-API (Hugging Face)](https://huggingface.co/spaces/hrishikeshdutta/OmniGuard-API) |

## 🏗️ System Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS v4. Managed via Vercel.
- **Backend**: Node.js + Express + WebSocket. Managed via Hugging Face Docker SDK.
- **Database**: Firebase Firestore for real-time state persistence.
- **AI Engine**: Google Gemini 1.5 Flash for automated multimodal triage.

## 📂 Repository Structure

```text
OmniGuard/
├── OmniGuard__frontend/    # React Tactical Dashboard
├── OmniGuard__backend/     # Node.js API & WebSocket Server
│   └── server/             # Core Backend Logic
├── COLLABORATION.md        # Frontend-Backend integration guide
├── ARCHITECTURE.md         # Detailed technical design
└── CONTRIBUTING.md         # Guidelines for developers
```

## 🔑 Test Credentials (Dev/Stage)

The system is pre-seeded with these test accounts for verification:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Coordinator** | `coordinator@omniguard.io` | `omni2024!` | Full Command & Map |
| **Responder (Medic)** | `medic1@omniguard.io` | `resp2024!` | Medical Unit View |
| **Responder (Fire)** | `fire_beta@omniguard.io` | `resp2024!` | Fire Unit View |
| **Civilian (User)** | `civilian@omniguard.io` | `civ2024!` | Standard Portal |

## 🚨 Public Incident Reporting

OmniGuard supports anonymous public reporting via [omniguard-suite.vercel.app/report](https://omniguard-suite.vercel.app/report). 

- **Unauthenticated Flow**: No login required for civilians.
- **Auto-Triage**: Public reports are automatically categorized and routed to teams.
- **Deep-Linking**: Use `?type=fire` or `?type=medical` query params to pre-fill the reporting form.

## 🛠️ Getting Started

For detailed setup instructions, please refer to the documentation in each subdirectory:
- [Frontend Setup Guide](./OmniGuard__frontend/README.md)
- [Backend Setup Guide](./OmniGuard__backend/server/README.md)

---
© 2026 OmniGuard Systems • Authorized Personnel Only
