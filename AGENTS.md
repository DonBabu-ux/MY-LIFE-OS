# AGENTS.md — MyLifeOS

> Entry point for any AI working on this codebase.
> Read this before touching code. Then read `MYLIFEOS_BLUEPRINT.md`.

## Project in one line
MyLifeOS is an **offline-first, privacy-first** Android app (React Native) that unifies
finance, receipts, notes, diary, tasks, shopping, phone usage, activity and contacts
into one local system. **The device is the source of truth. The cloud is optional.**

## Golden rules — never violate

1. Offline-first. Every core feature works with zero internet. No screen blocks on network.
2. Device is source of truth. SQLite on-device is authoritative.
3. Consent per category. Nothing is uploaded unless the user enabled sync for that category.
4. Encryption at rest. Sensitive data encrypted; files in app-private storage; keys in Keystore.
5. Permission-aware. Always: check → request → degrade gracefully.
6. No silent telemetry.
7. No raw personal content in logs. Redact amounts, names, message bodies, coordinates, paths.
8. If a feature can be local, it must be local.

## Architecture (one glance)

UI  →  features/<module>  →  services  →  db/repositories  →  SQLite
                    ↘ state (Zustand)                    ↗
                    ↘ sync/SyncEngine → API (opt-in) → MySQL

- UI **never** touches SQLite directly.
- Features import only from: `components/`, `design-system/`, `db/`, `services/`, `security/`, `permissions/`, `state/`, `utils/`, `constants/`, `hooks/`, `types/`, `shared/`.
- Modules must not import another module's internals — only via their `index.ts`.

## Folder contract (top level)

app/      React Native client (this is what we build first)
server/   Optional Node.js + Express backend (Phase 6)
shared/   Types, validators, DTOs, enums — pure TS, no RN, no Node
docs/     Specs + ADRs + this file's siblings
scripts/  Dev + build helpers
tests/    e2e / integration / fixtures

## Feature-add recipe (memorize this)

When adding a new feature/module:

1. Types in `shared/src/entities/<Entity>.ts`
2. Zod validator in `shared/src/validators/<entity>.schema.ts`
3. SQLite migration in `app/src/db/migrations/NNN_<area>.ts`
4. Repository in `app/src/db/repositories/<entity>Repository.ts`
5. Feature folder in `app/src/features/<module>/` with:
   - screens/ · components/ · hooks/ · services/ · state/ · __tests__/
   - `index.ts` exporting the public surface only
6. Sync mapper in `app/src/sync/mappers/<entity>Mapper.ts`
7. Module doc in `docs/07-modules/<module>.md`
8. Tests in `app/src/features/<module>/__tests__/`

## Never

- Never invent a top-level folder. If something doesn't fit, write an ADR first.
- Never hardcode colors, spacing, or font sizes — use `design-system/`.
- Never log PII (see golden rule 7).
- Never call SQLite from a screen or component — go through a repository.
- Never bypass the SyncQueue for syncable entities.
- Never add a permission without a fallback path.

## Frontend progress (current)

- [x] Repo skeleton
- [x] F1 hygiene files
- [x] F2 app bootstrap
- [x] F3 design system
- [x] F4 primitives
- [x] F5 layout + feedback
- [x] F6 navigation
- [x] F7 screens
- [x] F8 dashboard feature (Batch 2)
- [x] F9 finance feature (Batch 3)
- [x] F9.1 receipts feature (Batch 4)
- [ ] F10 Android native run     ← we are here

## Companion docs

- `MYLIFEOS_BLUEPRINT.md` — full system spec (the source of truth)
- `docs/00-folder-structure.md` — physical tree
- `docs/06-design-system.md` — tokens, principles, motion