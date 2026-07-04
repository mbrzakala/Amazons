---
stage: 4-backend
step: 4
source: Hackathon Wiki/stages/4-backend/steps/4-frontend-backend-contract.md
---

# Validator — 4. Angular ↔ NestJS Contract

Checks: `Hackathon Wiki/stages/4-backend/steps/4-frontend-backend-contract.md`.

## What this step is proving

The frontend now calls the real NestJS API (not the fake JSON Server) for the features
migrated in steps 1-3, switched via config rather than a hardcoded change, with the
switch applied per-feature rather than all-or-nothing.

## Evidence to gather

- The frontend `ConfigProvider` (or equivalent) source, checked for `fakeApiUrl()` and
  `apiUrl()` loaded from config, not hardcoded.
- The HTTP interceptor source, checked for which base URL each feature uses.
- A live browser test: run frontend + backend together, exercise one migrated
  feature's list/detail/create/update/delete.
- A note on which features (if any) are deliberately still on the fake API.

## Gate checklist

1. **The interceptor reads the API base URL from `ConfigProvider`, not a hardcoded
   string.**
   Evidence: interceptor source.
2. **At least one full feature (list + create at minimum) works end-to-end from
   Angular UI through NestJS to Postgres.**
   Evidence: live browser test result.
3. **Any feature still on the fake API is a deliberate, known state — not an
   oversight.**
   Evidence: team note identifying which features remain on the fake API and why.

Corresponding Result/DoD (once filled): the switch is feature-scoped (not a single
global hardcoded flag with no way back); one full feature verified end-to-end (UI
action → NestJS → Postgres → UI update).

See `agent_doc/README.md` for the verdict scale and reporting format.
