---
stage: 5-deployment
task: 3
---

# 3. Cloud Build → Artifact Registry → Cloud Run

**What to do:** Containerize and deploy each service (MCP server, backend, frontend) through the same repeating pipeline: build with Cloud Build, push to Artifact Registry, deploy to Cloud Run.

**How:**
1. For each service, run and test it locally first — don't debug a broken service for the first time in the cloud.
2. Update the service's `build-*.yaml` to point at your own project/region/registry name — these files often ship with another project's hardcoded values and will silently push to the wrong place otherwise.
3. Build the container: `gcloud builds submit --config=build-<service>.yaml`.
4. Deploy to Cloud Run: `gcloud run deploy <service> --image=<region>-docker.pkg.dev/$GCP_PROJECT/containers/<service>:latest --region=$REGION --platform=managed --allow-unauthenticated --memory=2Gi --min-instances=1 --set-env-vars=...`.
5. Deploy in dependency order — MCP server first, then backend (needs the MCP server's URL), then frontend (needs the backend's URL) — passing each prior service's real Cloud Run URL as an env var to the next.

**Recommended tool:** `gcloud builds submit` + `gcloud run deploy`. Reference: `stages/5-deployment/gdg-mcp-workshop/GCP Deploy Windows 11.md` — the "Assembly Line — 4 Stages" section has the exact verified command for every service, including the URL-chaining between stages.

## Gate

- [ ] Every `build-*.yaml` references your own project/region/registry, not a leftover example value.
- [ ] Each service builds successfully via Cloud Build and appears in Artifact Registry.
- [ ] Each service deploys to Cloud Run and returns a live URL.
- [ ] Downstream services were deployed with the correct upstream URL as an env var (not `localhost`).

Next: [[4-cloud-sql-connection]].

## Result

**Scope:** Get every service (MCP server, backend, frontend) built via Cloud Build and running on Cloud Run, wired together by real deployed URLs.

**DoD:**
- [ ] All services have a live Cloud Run URL.
- [ ] Each service's env vars point at the real upstream URL, not localhost.
- [ ] `gcloud run services describe <service> --format="value(status.url)"` succeeds for every service.

**Layers:** infra: Cloud Build, Artifact Registry, Cloud Run.
