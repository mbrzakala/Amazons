---
stage: 4-backend
step: 3
source: Hackathon Wiki/stages/4-backend/steps/3-docker-sequelize-postgres.md
---

# Validator — 3. Docker + Sequelize: Postgres Persistence

Checks: `Hackathon Wiki/stages/4-backend/steps/3-docker-sequelize-postgres.md`.

## What this step is proving

The in-memory service was replaced by a real Postgres database (Docker + Sequelize)
without changing the API's response contract from step 2 — schema owned by SQL init
scripts, not Sequelize auto-sync.

## Evidence to gather

- `docker/docker-compose.yml` and `docker/init/*.sql`.
- `docker compose up` + a direct `psql` query against the running container.
- `SequelizeModule.forRoot(...)` config in `AppModule`, specifically the `synchronize`
  flag.
- Service source: confirm methods are `async`/`await`, use `@InjectModel`, and the old
  in-memory array/counter is gone.
- A diff of the Swagger response shape before (step 2) vs. after this step.

## Gate checklist

1. **`docker compose up` starts Postgres and the seed data is queryable.**
   Evidence: `psql` query result.
2. **`SequelizeModule.forRoot` has `synchronize: false`.**
   Evidence: the config line.
3. **Every service method is `async`, uses the injected model
   (`findAll`/`findOne`/`create`/`update`/`destroy`), and the in-memory array/counter is
   deleted.**
   Evidence: service source.
4. **Swagger UI still returns the same response shape as step 2** — the API contract
   didn't change, only its data source.
   Evidence: response shape comparison.

Corresponding Result/DoD (once filled): Docker Compose Postgres container runs with the
feature's table pre-seeded; `synchronize: false` set; no Sequelize auto-migration.

See `agent_doc/README.md` for the verdict scale and reporting format.
