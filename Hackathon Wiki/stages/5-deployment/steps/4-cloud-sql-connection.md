---
stage: 5-deployment
task: 4
---

# 4. Cloud SQL Connection for the Backend

**What to do:** Connect the deployed NestJS backend to the Cloud SQL instance from step 1, both for local development and in production.

**How:**
1. For local development, run the Cloud SQL Auth Proxy against the instance (`./cloud-sql-proxy $GCP_PROJECT:$REGION:<instance> --port 5432`) and point `DATABASE_URL` at `localhost:5432`.
2. For the deployed backend, add the Cloud SQL instance to the Cloud Run service with `--add-cloudsql-instances=$GCP_PROJECT:$REGION:<instance>`, and set `DATABASE_URL` to use the Unix socket path (`.../cloudsql/$GCP_PROJECT:$REGION:<instance>`), not a TCP host — Cloud Run reaches Cloud SQL through the socket, not the public IP.
3. Redeploy the backend with these flags and confirm it logs a successful database connection on startup, not a connection-refused error.

**Recommended tool:** Cloud SQL Auth Proxy (local) + `--add-cloudsql-instances` (Cloud Run). Reference: `stages/5-deployment/gdg-mcp-workshop/GCP Deploy Windows 11.md`, "Stage 3: NestJS Backend" section, for the exact proxy download, port, and deploy-flag commands.

## Gate

- [ ] Local dev connects to Cloud SQL through the proxy, not a hardcoded direct IP.
- [ ] The deployed backend's Cloud Run service has `--add-cloudsql-instances` set.
- [ ] The deployed `DATABASE_URL` uses the `/cloudsql/...` socket path, not a public TCP host.
- [ ] The backend's startup logs confirm a successful DB connection in production, not just locally.

Next: [[5-observability-cloud-logging]].

## Result

**Scope:** Wire the deployed backend to Cloud SQL correctly for both local development (proxy) and production (Unix socket via Cloud Run's Cloud SQL integration).

**DoD:**
- [ ] Local dev works through the Cloud SQL Auth Proxy.
- [ ] Production Cloud Run service has `--add-cloudsql-instances` and a socket-path `DATABASE_URL`.
- [ ] A real query against production data succeeds end-to-end (e.g. through Swagger against the deployed URL).

**Layers:** infra: Cloud SQL connectivity; backend: database config.
