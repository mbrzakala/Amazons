---
stage: 4-backend
task: 1
---

# 1. NestJS Feature Module (CRUD)

**What to do:** Scaffold the first backend feature (the product's core resource) as a NestJS module with the standard 5-part shape: model, service, controller, module, DTOs.

**How:**
1. Create a feature folder under `apps/<api-app>/src/app/<feature>/` with: `models/<feature>.interface.ts` (DTOs), `<feature>.service.ts`, `<feature>.controller.ts`, `<feature>.module.ts`.
2. Define DTOs with `class-validator` decorators (`@IsString`, `@IsInt`, `@IsEmail`, ...) and derive `CreateXDto`/`UpdateXDto` from the base DTO with NestJS's `OmitType`/`PartialType` utilities — don't hand-write three near-duplicate classes.
3. Start the service with in-memory storage (array + counter) so the controller/routes can be verified end-to-end before touching the database (step 3 migrates this to Sequelize).
4. Register the feature module in the root `AppModule`'s `imports`.

**Recommended tool:** Write directly, following the confirmed working pattern in `nan-stack`'s `apps/api/src/app/user/` (real files: `user.controller.ts`, `user.service.ts`, `user.module.ts`, `models/user.interface.ts`). Reference: `nestJS/01-modules.md`, `02-controllers.md`, `03-providers-services.md`, `11-dtos-validation.md`.

## Gate

- [ ] The feature folder has all 5 parts (model/DTOs, service, controller, module) — nothing dumped into a shared top-level folder.
- [ ] `CreateXDto`/`UpdateXDto` are derived from the base DTO via `OmitType`/`PartialType`, not hand-duplicated.
- [ ] The module is registered in `AppModule`'s `imports`.
- [ ] Every endpoint (list, get-by-id, create, update, delete) works against the in-memory service.

Next: [[2-api-contract-swagger-cors-validation]].

## Result

**Scope:** Stand up the first backend feature module end-to-end (in-memory), following the confirmed NestJS feature-folder shape.

**DoD:**
- [ ] One feature module exists with model/DTOs, service, controller, module files.
- [ ] All CRUD routes respond correctly against the in-memory service.
- [ ] DTOs use `class-validator` decorators and `OmitType`/`PartialType` derivation.

**Layers:** backend: NestJS module, DTOs, in-memory service.
