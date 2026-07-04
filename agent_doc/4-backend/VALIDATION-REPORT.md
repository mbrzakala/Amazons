---
stage: 4-backend
generated: 2026-07-04
scope: apps/backend/backend-api
---

# Stage 4 — Backend: Validator Report

Run against the 8 validators in `agent_doc/4-backend/*.md`, which mirror
`Hackathon Wiki/stages/4-backend/steps/*.md`. Report-only — does not edit the wiki's
own Gate/Result sections.

**Scope checked:** `apps/backend/backend-api` (the NestJS app). `adk-agents`,
`mcp-server`, `embeddings` are separate services, out of scope for these
NestJS-specific gates.

**Bottom line up front:** none of the 8 gates pass. What exists is a single custom
endpoint set (`solve` / `history` / `rate`, `app.controller.ts`) wired straight to
Prisma + an external ADK agent — real, working logic, but built as one flat `app/`
module rather than following the stage's step-by-step scaffold (feature module → DTOs
→ Swagger/validation → Sequelize/Docker → frontend switch → evals → agentic loop →
multi-agent). So the gates below fail structurally, not because nothing works.

---

## Step 1 — NestJS Feature Module (CRUD): FAIL

- No `<feature>/` folder at all — everything (`app.controller.ts`, `app.service.ts`,
  `prisma.service.ts`) sits in the top-level `app/` directory, not split into
  `models/`, service, controller, module per feature.
- No DTO classes anywhere — `app.controller.ts:12-17` pulls fields straight off
  `@Body('problemDescription')`, so `OmitType`/`PartialType` derivation doesn't apply
  (nothing to derive from).
- No feature module exists to register in `AppModule` — `app.module.ts` only wires
  `AppController`/`AppService`/`PrismaService` directly.
- Endpoints (`solve`, `history`, `rate`) aren't a generic list/get-by-id/create/update/
  delete CRUD set — they're bespoke chat-flow routes.

## Step 2 — Swagger, Validation, CORS: FAIL

- No `@nestjs/swagger` in `package.json` and no `DocumentBuilder`/
  `SwaggerModule.setup` in `main.ts` — no Swagger UI.
- No `class-validator`/`class-transformer` dependency, no
  `app.useGlobalPipes(new ValidationPipe())` in main.ts.
- CORS is `origin: '*'` at `main.ts:29` — explicitly not scoped to the frontend's real
  origin.
- No `NotFoundException` usage anywhere in the codebase — `rateSolution` on a
  nonexistent id (`app.service.ts:128-133`) would surface a raw Prisma error, not a
  404.

## Step 3 — Docker + Sequelize Postgres Persistence: FAIL

- No `docker-compose.yml` or `docker/init/*.sql` anywhere in the repo — can't spin
  up/query Postgres locally per the spec.
- Persistence uses **Prisma**, not Sequelize (schema at `prisma/schema.prisma`) —
  different tool than the step prescribes.
- Worse, `main.ts:13-23` runs `prisma db push --accept-data-loss` automatically on
  every production boot — that's schema auto-sync at runtime, the exact opposite of
  the "schema owned by SQL init scripts, `synchronize: false`" requirement, and
  `--accept-data-loss` is a real risk on a running prod DB.
- One thing that *is* right: service methods are properly `async`/`await` against an
  injected model (`app.service.ts:113-133`) — no in-memory array ever existed here, it
  went straight to the DB.

## Step 4 — Angular ↔ NestJS Contract: FAIL

- `apps/frontend/src` is still the untouched Nx Angular starter (`nx-welcome.ts`, no
  services, no `HttpClient` usage, no interceptor, no environment/config files found
  in a repo-wide search).
- The frontend doesn't call `backend-api` at all yet — nothing to verify end-to-end.

## Step 5 — Evaluation Scoreboards: FAIL

- No `wcs`/`web-codegen-scorer` references, config, or reports anywhere in the repo.

## Step 6 — Agentic Loops with Tool Calls: FAIL

- No agentic-runner eval exists; depends on step 5's baseline, which also doesn't
  exist.

## Step 7 — Context Engineering: FAIL / UNKNOWN

- The `agent_doc/4-backend/*.md` files themselves have frontmatter (stage/step/
  source), but they're the hackathon's own step-validator specs, not capability-scoped
  coding-agent guidance partials with trigger keywords tied to lint/build rules.
- No retrieval mechanism (keyword/error match → partial) found, and no logged
  instance of an error being resolved this way.

## Step 8 — Multi-Agent Systems: FAIL

- Repo-wide search for planner/writer/fixer or a gated-agent runner (e.g.
  `workflow-gated-agent.runner.mjs`) turned up nothing under `apps/`. Code generation
  here wasn't done via isolated planner/writer/fixer roles.

---

## Verdict scale used (per `agent_doc/README.md`)

FAIL = evidence directly contradicts the gate item; nothing here was UNKNOWN — the
repo has clear evidence either way for every checked item.

## What this actually means

There is a functioning vertical slice (Prisma-backed endpoint calling an external ADK
agent, containerized via its own `Dockerfile`) — it's just not shaped like the
tutorial's CRUD-first path, so it fails these specific gates. Highest-leverage next
steps, in order:

1. Split `solve`/`history`/`rate` into a real feature module with DTOs.
2. Add Swagger + a global `ValidationPipe` + scope CORS to the real frontend origin.
3. Stop auto-`db push` in prod and set up Docker Compose + a fixed schema (or
   consciously decide Prisma replaces the Sequelize requirement and update the DoD).

Steps 5-8 (evals, agentic loop, context engineering, multi-agent) haven't been started
at all.
