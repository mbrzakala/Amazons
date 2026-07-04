---
stage: 4-backend
step: 1
source: Hackathon Wiki/stages/4-backend/steps/1-nestjs-feature-module.md
---

# Validator — 1. NestJS Feature Module (CRUD)

Checks: `Hackathon Wiki/stages/4-backend/steps/1-nestjs-feature-module.md`.

## What this step is proving

The first backend feature exists as a proper NestJS module with the standard 5-part
shape (model/DTOs, service, controller, module), DTOs derived rather than
hand-duplicated, registered in `AppModule`, and every CRUD endpoint works against an
in-memory service.

## Evidence to gather

- `apps/<api-app>/src/app/<feature>/` folder contents: `models/<feature>.interface.ts`,
  `<feature>.service.ts`, `<feature>.controller.ts`, `<feature>.module.ts`.
- DTO source, checked for `OmitType`/`PartialType` usage vs. hand-written duplicate
  classes.
- `AppModule`'s `imports` array.
- A manual or automated request against each endpoint (list, get-by-id, create,
  update, delete).

## Gate checklist

1. **The feature folder has all 5 parts — nothing dumped into a shared top-level
   folder.**
   Evidence: folder listing.
2. **`CreateXDto`/`UpdateXDto` are derived from the base DTO via
   `OmitType`/`PartialType`, not hand-duplicated.**
   Evidence: DTO source.
3. **The module is registered in `AppModule`'s `imports`.**
   Evidence: `app.module.ts`.
4. **Every endpoint (list, get-by-id, create, update, delete) works against the
   in-memory service.**
   Evidence: live request/response for each of the 5 operations.

Corresponding Result/DoD (once filled): DTOs use `class-validator` decorators and
`OmitType`/`PartialType` derivation; all CRUD routes respond correctly.

See `agent_doc/README.md` for the verdict scale and reporting format.
