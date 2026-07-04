---
stage: 5-deployment
generated: 2026-07-04
scope: live GCP project gen-lang-client-0338633763 (europe-west1) + apps/backend/{mcp-server,backend-api,adk-agents,embeddings}, apps/frontend
---

# Stage 5 — Deployment: Validator Report

Run against the 5 validators in `agent_doc/5-deployment/*.md`, which mirror
`Hackathon Wiki/stages/5-deployment/steps/*.md`. Report-only — does not edit the
wiki's own Gate/Result sections. Evidence gathered live via `gcloud`, `curl`, and repo
source, not assumptions.

**Bottom line up front:** this is by far the strongest stage in the repo — real GCP
infra, a real Cloud Build pipeline, all five services actually live on Cloud Run. 3 of
5 steps PASS. But there is one serious, high-visibility FAIL: **the deployed frontend
is not wired to the real backend at all.** It ships with mock data turned on by
default and a dead `BACKEND_URL` env var that nothing reads. A judge clicking around
your live URL right now is looking at fake data, not your real product. This is the
single highest-leverage fix before demo day.

---

## Step 1 — GCP Foundation: PASS

- `gcloud config get-value project` → `gen-lang-client-0338633763`, region
  `europe-west1` (via Cloud Run/SQL location, not a global config default).
- APIs enabled: `run`, `cloudbuild`, `artifactregistry`, `sqladmin`/`sql-component`,
  `compute`, `aiplatform` — all present. (`secretmanager` is *not* enabled, but nothing
  in the codebase calls it — `DATABASE_URL` passwords are passed as plain Cloud Run
  env vars instead, see Step 4 note.)
- Artifact Registry repo `amazons-repo` (DOCKER, STANDARD) exists in `europe-west1`.
- Cloud SQL instance `amazons-db` (`POSTGRES_15`, `RUNNABLE`, `europe-west1-c`) exists
  with database `amazons`; reachability is independently confirmed by Step 4's
  production connection logs.

## Step 2 — Custom MCP Server: pytriz Tool Wrapping: PASS

- `apps/backend/mcp-server/app/services/triz.py:8-9` — `get_store()` is
  `@lru_cache(maxsize=1)`, a true singleton reused across requests, not re-instantiated
  per call.
- `apps/backend/mcp-server/app/tools/__init__.py` — six explicitly named tools
  (`browse_contradiction_matrix`, `search_parameter`, `search_principle`,
  `get_random_principles`, `get_principle_by_id`, `get_parameter_by_id`) registered
  individually via `mcp.tool()`, not one catch-all function.
- Deployed and reachable at `amazons-mcp-server` on Cloud Run; production logs show
  real `HTTP/1.1 200 OK` calls out to the embeddings service (e.g.
  `2026-07-04T11:07:56Z`), i.e. genuine tool activity, not stubbed responses.
- Caveat: I didn't independently drive a fresh MCP client tool-list/call this session
  — the PASS above rests on code inspection + production log evidence of real traffic,
  not a live client connection I made myself. Worth a 2-minute MCP Inspector check
  before demo day to be fully sure.

## Step 3 — Cloud Build → Artifact Registry → Cloud Run: FAIL

- Gate 1 PASS — all five `build-*.yaml` use `${PROJECT_ID}/${_REGION}/${_REGISTRY_NAME}`
  substitutions with real defaults (`europe-west1` / `amazons-repo`) matching what's
  actually deployed, no leftover example values.
- Gate 2 PASS — all five images (`amazons-adk-agent`, `amazons-backend`,
  `amazons-embeddings`, `amazons-frontend`, `amazons-mcp-server`) exist in
  `amazons-repo` with recent build timestamps (2026-07-04).
- Gate 3 PASS — all five services have live Cloud Run URLs (`amazons-adk-agent`,
  `amazons-backend`, `amazons-embeddings`, `amazons-frontend`, `amazons-mcp-server`).
- **Gate 4 FAIL** — three of four upstream wirings are correct:
  `amazons-adk-agent`'s `MCP_SERVER_URL`, `amazons-backend`'s `ADK_AGENT_URL`, and
  `amazons-mcp-server`'s `EMBEDDING_SERVICE_URL` all point at real deployed Cloud Run
  URLs. But `amazons-frontend`'s `BACKEND_URL` env var is set with **no value at all**
  (`gcloud run services describe amazons-frontend --format=json` shows
  `{"name": "BACKEND_URL"}`, no `value` key). And even if it were set, it wouldn't
  matter: `apps/frontend/nginx.conf` only substitutes `${PORT}`, never
  `${BACKEND_URL}` — the variable is plumbed into the container but nothing consumes
  it. The real problem is one layer deeper: the Angular app hardcodes its API target
  at build time in `apps/frontend/src/app/core/config.provider.ts:16-19`
  (`DEFAULT_API_CONFIG = { useFakeApi: true, realApiUrl: 'http://localhost:3000/api' }`)
  and `app.config.ts:13` wires that constant in directly with no env override. **The
  deployed frontend runs entirely on mock data by default** — it was never pointed at
  the real backend at all, in any environment.

## Step 4 — Cloud SQL Connection for the Backend: FAIL

- **Gate 1 FAIL** — local dev (`docker-compose.yml`) spins up its own throwaway
  `postgres:16-alpine` container and points `DATABASE_URL` at it directly; it never
  runs the Cloud SQL Auth Proxy against `amazons-db` at all. It's not a hardcoded
  direct IP either, but it also doesn't satisfy "connects to Cloud SQL through the
  proxy" — local and prod use two entirely different databases.
- Gate 2 PASS — `amazons-backend`'s Cloud Run service has
  `run.googleapis.com/cloudsql-instances: gen-lang-client-0338633763:europe-west1:amazons-db`
  set.
- Gate 3 PASS — deployed `DATABASE_URL` is
  `postgresql://postgres:inventapassword@localhost:5432/amazons?host=/cloudsql/gen-lang-client-0338633763:europe-west1:amazons-db`
  — the `localhost:5432` portion is Prisma's required placeholder syntax; the actual
  connection goes over the `?host=/cloudsql/...` Unix socket, not a public TCP host.
  (Separately worth noting: the DB password is sitting in plaintext in a Cloud Run env
  var rather than Secret Manager — not part of this gate, but a real hardening gap.)
- Gate 4 PASS — production startup logs
  (`2026-07-04T11:07:25–31Z`) show `Executing automated Prisma schema push to
  database...` → `Datasource "db": PostgreSQL database "amazons"... at "localhost:5432"`
  → `Automated database schema push completed successfully!` → NestJS started clean.
  Real, successful production DB connection, not connection-refused.
- One FAIL item is enough to fail the step per the verdict scale, but three of four
  gates are solid — this is much closer to done than Step 3.

## Step 5 — Observability: Cloud Logging: INCOMPLETE

- Gate 1 PASS — `gcloud logging read` filtered by `resource.labels.service_name`
  returned real entries for all five services (backend, mcp-server, adk-agent,
  embeddings, frontend).
- Gate 2 PASS — verified live this session: sent
  `curl https://amazons-backend-.../api` at `2026-07-04T11:27:19Z`, and the matching
  404 log line (`.../api  404`) was visible via `gcloud logging read` within seconds —
  well under the one-minute bar.
- Gate 3 UNKNOWN (team self-report per the validator's own rules — not checkable from
  the repo). Given how fast Gate 2 was to confirm just now, the tooling is clearly in
  place; whether the team *habitually* reaches for it first is a judgment call only
  they can make.

---

## What would move the needle most before judging

1. **Fix Step 3's frontend wiring** — this is the top priority. Point
   `config.provider.ts`'s `DEFAULT_API_CONFIG` at the real `amazons-backend` URL and
   flip `useFakeApi` to `false` for the deployed build (e.g. via an Angular
   environment file baked in at build time, since static Angular can't read Cloud
   Run env vars at runtime anyway — the current `BACKEND_URL` plumbing is a dead end
   and can be removed once this is fixed). Right now the live demo URL shows fake data
   no matter what's happening in the real backend/DB/agent — that's the one thing a
   judge testing your app live would notice immediately.
2. **Step 4's local dev gap** is lower stakes for judging (nobody demos your
   `docker-compose` setup) but quick to close: swap the local Postgres container for
   the Cloud SQL Auth Proxy if you want the literal gate satisfied, or note in your
   pitch that local uses a disposable DB by design.
3. Everything else in this stage is genuinely solid and demo-ready.

## Verdict scale used (per `agent_doc/README.md`)

PASS = every gate item PASS. FAIL = at least one gate item FAIL. INCOMPLETE = no
FAILs but at least one UNKNOWN.
