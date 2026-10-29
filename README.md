# MyLifeOS (M.Y.O.S.)

> My Life Operating System — a private, offline-first personal control center for money, time, information, activity and everyday life.

**Platform:** Android (React Native)  
**Principle:** The device is the source of truth. The cloud is optional.

---

## Features

| Module | What it does |
|---|---|
| **Finance** | Track income, expenses, transfers; parse SMS; categorize; analyze |
| **Receipts** | Import, OCR, store, search receipts; detect duplicates |
| **Shopping** | Lists, quantities, priorities, budget vs estimate tracking |
| **Notes** | Text notes, folders, tags, attachments, full-text search |
| **Diary** | Dated entries, media, mood, private flag, timeline + calendar |
| **Planner** | Time blocks, tasks, priorities, recurrence, reminders |
| **Phone Usage** | App usage stats, top apps, focus rules |
| **Activity** | Steps, distance, active time; optional location |
| **Contacts** | Local searchable directory; duplicate detection |

## Golden Rules

1. **Offline-first.** Every core feature works with zero internet.
2. **Device is source of truth.** SQLite on the device is authoritative.
3. **Consent per category.** Nothing uploaded without explicit opt-in.
4. **Encryption at rest.** SQLCipher + Android Keystore.
5. **Permission-aware.** Check → request → degrade gracefully.
6. **No silent telemetry.**
7. **No raw PII in logs.**

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> mylifeos
cd mylifeos
npm install

# 2. Start Metro bundler
cd app
npx react-native start --reset-cache

# 3. Run on Android
npx react-native run-android
```

## Monorepo Structure

```
mylifeos/
├── app/        ← React Native client (primary)
├── server/     ← Optional Node.js + Express backend (Phase 6)
├── shared/     ← Types, validators, DTOs — pure TS, no RN/Node
├── docs/       ← Specs, ADRs, module docs
├── scripts/    ← Dev + build helpers
└── tests/      ← E2E, integration, fixtures
```

## Tech Stack

- React Native 0.76 (TypeScript strict)
- SQLite via SQLCipher (op-sqlite)
- React Navigation 6
- Zustand + Redux Toolkit
- React Query
- Reanimated 3
- Zod validation

## Docs

- [Architecture](docs/01-architecture.md)
- [Data Model](docs/02-data-model.md)
- [Sync Protocol](docs/03-sync-protocol.md)
- [Security & Privacy](docs/04-security-privacy.md)
- [Design System](docs/06-design-system.md)
- [Roadmap](docs/08-roadmap.md)

## License

UNLICENSED — Private project.
>>>>>>> cd5542b (feat: setup project, fix TypeScript errors, and add OtaKit automated update workflow)
