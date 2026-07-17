# NALA Field Inspections — Offline-First PWA

Offline-first inspection capture for NALA closed mine sites, per the PRD (v1.0) with domain
fields taken from `../Nerizon_Structural_Integrity_Assessment_NALA.xlsx` (the 27-column
Inspections sheet, its cascading dropdowns, and derived priority/risk logic).

## Run

```bash
npm install
npm run dev        # dev server (SW disabled in dev)
npm run build      # typecheck + production build + service worker
npm run preview    # serve the production build (test PWA/offline here)
npm test           # Vitest unit suites (Dexie on fake-indexeddb, mocked backend)
npm run lint       # ESLint (typescript-eslint + react-hooks)
npm run typecheck  # tsc project references, no emit
```

Conventions: see `.agent/` — `AGENT_RULES.md` (how work is run), `ENGINEERING_PRACTICES.md`
(engineering bar), `CONTRIBUTING.md` (branches + Conventional Commits). Branch per task
(`type/short-desc`), never commit to `main`, CI green before merge.

Offline behaviour, install (A2HS), and Background Sync need the **production build over
HTTPS** (or localhost). iOS requires the installed home-screen app for full behaviour.

## Configure

Open **⚙️ Setup** in the app: backend URL (n8n webhook base), bearer token, engineer
email, inspector name. Without a backend URL the app still captures fully offline; the
sync engine reports "backend URL not configured" and retries once configured.

## Backend contract (PRD §8) — what the n8n workflows must implement

| Endpoint | Method | Behaviour |
|---|---|---|
| `{base}/health` | HEAD | 200 = reachable (connectivity heartbeat) |
| `{base}/field-intake` | POST | JSON body; **dedupe on `Idempotency-Key` header = `clientRecordId` before the Excel append**; return 200 for accepted *and* already-exists |
| `{base}/field-photo` | POST | multipart `clientRecordId, photoId, file`; idempotent on `photoId` |
| `{base}/assets?siteCode=` | GET | JSON array of assets for the local cache (fields per `RemoteAsset` in `src/sync/api.ts`) |
| `{base}/auth/refresh` | POST | `{ token, expiresAtUtc? }` |

Client behaviour on responses: 2xx/409 → `synced`; 401 → refresh token, retry once;
other 4xx → `failedPermanent` (surfaced, never retried); 5xx/network → `failed` with
exponential backoff + jitter, max 8 attempts.

## Domain data

`src/domain/lookups.ts` is **generated** from the workbook (15 deficiency categories with
their description/mechanism/focus-area cascades, 26 component types with sub-components,
10 sites, P1–P5 with condition descriptions). Regenerate after workbook changes:

```bash
python scripts/generate-lookups.py
```

Derived logic (`src/domain/derive.ts`): Priority Description from Priority Rating;
Risk Rank = severity × likelihood on a 3×3 matrix (High=3/Med=2/Low=1), Risk Rating
High 6–9 / Medium 3–4 / Low 1–2. **Open question with Nerizon:** the workbook's Site
Summary contains a Glencore 5×5 matrix (Consequence 1–5 × Likelihood A–E) that
contradicts this — confirm before ship and adjust `derive.ts` + the two selects if the
5×5 wins.

## Key design points

- Dexie/IndexedDB is the source of truth; saves never touch the network
  (`src/db/submissions.ts`). Soft delete only; `navigator.storage.persist()` on first run.
- The flush algorithm (`src/sync/flushCore.ts`) is DOM-free and runs both in the window
  (online/visibility/launch/timer/manual triggers) and in the service worker via
  Background Sync on Chromium. iOS uses the foreground-flush path.
- Exactly-once: records advance to `synced` only on confirmed 2xx/409; the backend
  dedupes on `clientRecordId`. Photos upload after the record, idempotent on `photoId`.
- Service worker updates prompt for reload (`registerType: 'prompt'`) — the PRD's §5
  mentions `autoUpdate`, but §7.1 "never silently swap mid-capture" wins.
- Booleans (`isDeleted`, `uploaded`) are not IndexedDB index keys (spec limitation);
  they're plain fields filtered in code — the PRD's suggested indexes on them would
  silently not work.

## Acceptance test checklist (PRD §12)

Manual, on-device: 1) airplane-mode capture ×5 with photos → kill → reopen → all present;
2) reconnect → exactly 5 backend rows; 3) double-flush one record → still one row;
4) backend validation reject → `failedPermanent` in 🔧 Sync, others unaffected;
5) near-quota → photo capture blocked, text capture works; 6) expired token → refresh
then flush; 7) GPS denied → saves with `locationSource='unavailable'`.
