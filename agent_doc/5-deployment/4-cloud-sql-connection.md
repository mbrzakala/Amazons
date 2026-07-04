---
stage: 5-deployment
step: 4
source: Hackathon Wiki/stages/5-deployment/steps/4-cloud-sql-connection.md
---

# Validator — 4. Cloud SQL Connection for the Backend

Checks: `Hackathon Wiki/stages/5-deployment/steps/4-cloud-sql-connection.md`.

## What this step is proving

The deployed backend connects to Cloud SQL correctly for both local dev (Auth Proxy)
and production (Unix socket via Cloud Run's `--add-cloudsql-instances`), with a
confirmed successful connection in production logs — not just locally.

## Evidence to gather

- Local dev setup: Cloud SQL Auth Proxy invocation and `DATABASE_URL` pointing at
  `localhost:5432`.
- The deployed Cloud Run service's flags: `gcloud run services describe <service>`
  for `--add-cloudsql-instances` and the `DATABASE_URL` env var (socket path vs. TCP
  host).
- Cloud Logging startup logs for the deployed backend, confirming a successful DB
  connection (not connection-refused).

## Gate checklist

1. **Local dev connects to Cloud SQL through the proxy, not a hardcoded direct IP.**
   Evidence: local `DATABASE_URL`/proxy invocation.
2. **The deployed backend's Cloud Run service has `--add-cloudsql-instances` set.**
   Evidence: `gcloud run services describe` output.
3. **The deployed `DATABASE_URL` uses the `/cloudsql/...` socket path, not a public TCP
   host.**
   Evidence: deployed env var value.
4. **The backend's startup logs confirm a successful DB connection in production, not
   just locally.**
   Evidence: Cloud Logging entries at deploy/startup time.

Corresponding Result/DoD (once filled): local dev works through the Cloud SQL Auth
Proxy; production Cloud Run service has `--add-cloudsql-instances` and a socket-path
`DATABASE_URL`; a real query against production data succeeds end-to-end.

See `agent_doc/README.md` for the verdict scale and reporting format.
