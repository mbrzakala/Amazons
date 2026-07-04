---
stage: 4-backend
task: 3
---

# 3. Docker + Sequelize: Postgres Persistence

**What to do:** Replace the in-memory service with a real Postgres database via Docker and Sequelize, without changing the API contract from step 2.

**How:**
1. Start Postgres via Docker Compose (`docker compose up` against the repo's `docker/docker-compose.yml`); the schema is owned by SQL init scripts (`docker/init/*.sql`), not by Sequelize.
2. Register `SequelizeModule.forRoot({ dialect: 'postgres', ..., synchronize: false })` in `AppModule` — `synchronize` must stay `false` since the schema already exists.
3. Define one Sequelize model per table (`@Table`, `@Column`, `@PrimaryKey`, `@AutoIncrement`, `@ForeignKey`/`@HasMany` for relations), and register it with `SequelizeModule.forFeature([Model])` in that feature's own module.
4. Inject the model into the service via `@InjectModel(Model)`, convert every method to `async`/`await`, and add a `mapDbModelToDto` helper so the controller's response shape doesn't change from step 1.

**Recommended tool:** Write directly, following the confirmed working migration in `nan-stack` Lab 3 (`docker/docker-compose.yml`, `docker/init/*.sql`, `db/*.model.ts`, the before/after `user.service.ts`). Reference: `nestJS/09-orm-database.md`, `10-docker.md`.

## Gate

- [ ] `docker compose up` starts Postgres and the seed data is queryable (`docker exec -it <container> psql ...`).
- [ ] `SequelizeModule.forRoot` has `synchronize: false`.
- [ ] Every service method is `async`, uses the injected model (`findAll`/`findOne`/`create`/`update`/`destroy`), and the in-memory array/counter is deleted.
- [ ] Swagger UI still returns the same response shape as step 2 — the API contract didn't change, only its data source.

Next: [[4-frontend-backend-contract]].

## Result

**Scope:** Migrate the step-1 feature from in-memory storage to a real Postgres database via Sequelize, with the schema owned by SQL init scripts.

**DoD:**
- [ ] Docker Compose Postgres container runs with the feature's table pre-seeded.
- [ ] The service's CRUD methods are all `async` and backed by the injected Sequelize model.
- [ ] `synchronize: false` is set; no Sequelize auto-migration.

**Layers:** backend: ORM, database, Docker.
