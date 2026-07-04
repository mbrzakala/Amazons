---
stage: 5-deployment
step: 3
source: Hackathon Wiki/stages/5-deployment/steps/3-cloud-build-artifact-registry-cloud-run.md
---

# Validator — 3. Cloud Build → Artifact Registry → Cloud Run

Checks: `Hackathon Wiki/stages/5-deployment/steps/3-cloud-build-artifact-registry-cloud-run.md`.

## What this step is proving

Every service (MCP server, backend, frontend) is containerized and deployed through
the same pipeline (Cloud Build → Artifact Registry → Cloud Run), deployed in
dependency order, each downstream service wired to the real upstream Cloud Run URL —
not a leftover example value or `localhost`.

## Evidence to gather

- Each service's `build-*.yaml`, checked for the team's real project/region/registry
  values.
- `gcloud builds submit` history / Artifact Registry image listing per service.
- `gcloud run services describe <service> --format="value(status.url)"` for each
  service.
- Each service's deployed env vars, checked for real upstream URLs vs. `localhost`.

## Gate checklist

1. **Every `build-*.yaml` references your own project/region/registry, not a leftover
   example value.**
   Evidence: file contents.
2. **Each service builds successfully via Cloud Build and appears in Artifact
   Registry.**
   Evidence: build logs + registry listing.
3. **Each service deploys to Cloud Run and returns a live URL.**
   Evidence: `gcloud run services describe` output per service.
4. **Downstream services were deployed with the correct upstream URL as an env var (not
   `localhost`).**
   Evidence: deployed env var values.

Corresponding Result/DoD (once filled): all services have a live Cloud Run URL; each
service's env vars point at the real upstream URL, not localhost.

See `agent_doc/README.md` for the verdict scale and reporting format.
