---
stage: 4-backend
task: 4
---

# 4. Angular ↔ NestJS Contract

**What to do:** Point the Angular frontend at the real NestJS API instead of the fake JSON Server backend, without hardcoding the switch.

**How:**
1. Confirm the frontend's `ConfigProvider` (or equivalent, `providedIn: 'root'` since this is genuinely global config) exposes both `fakeApiUrl()` and `apiUrl()`, loaded from a config file rather than hardcoded.
2. In the HTTP interceptor, switch the base URL from `fakeApi` to the real `apiUrl` for the features migrated in steps 1-3.
3. Run frontend and backend together and confirm each migrated feature's list/detail/create/update/delete calls hit the real API and match the shapes returned by Swagger.
4. Leave any not-yet-migrated feature pointed at the fake API — the switch is per-feature, not all-or-nothing.

**Recommended tool:** Write directly, following the confirmed working `apps/frontend/src/app/config/app-interceptor.ts` + `ConfigProvider` pattern in `nan-stack`. Reference: `nestJS/12-dev-workflow-and-contract.md` for the real npm scripts and mock/real modes.

## Gate

- [ ] The interceptor reads the API base URL from `ConfigProvider`, not a hardcoded string.
- [ ] At least one full feature (list + create at minimum) works end-to-end from Angular UI through NestJS to Postgres.
- [ ] Any feature still on the fake API is a deliberate, known state — not an oversight.

Next: [[5-evaluation-scoreboards]].

## Result

**Scope:** Switch the frontend's HTTP layer from the fake JSON Server API to the real NestJS API for the features built in steps 1-3.

**DoD:**
- [ ] Interceptor/config switch is in place and feature-scoped (not a single global hardcoded flag with no way back).
- [ ] One full feature is verified end-to-end (UI action → NestJS → Postgres → UI update).

**Layers:** frontend: HTTP interceptor, config; backend: API consumed as contract.
