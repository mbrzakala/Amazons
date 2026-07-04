---
stage: 5-deployment
step: 1
source: Hackathon Wiki/stages/5-deployment/steps/1-gcp-foundation.md
---

# Validator — 1. GCP Foundation

Checks: `Hackathon Wiki/stages/5-deployment/steps/1-gcp-foundation.md`.

## What this step is proving

The GCP project foundation (correct project/region, required APIs, Artifact Registry
repo, Cloud SQL instance + database) is provisioned once, before anything is deployed
onto it.

## Evidence to gather

- `gcloud config get-value project` and `gcloud config get-value run/region`.
- `gcloud services list --enabled` for `run`, `cloudbuild`, `artifactregistry`,
  `sqladmin`, `secretmanager` (and `aiplatform`/`compute` if applicable).
- `gcloud artifacts repositories list` for the `containers` repo.
- `gcloud sql instances describe <name>` and `gcloud sql databases list --instance=<name>`.

## Gate checklist

1. **`gcloud config get-value project` returns the correct project.**
   Evidence: command output.
2. **All required APIs show as enabled.**
   Evidence: `gcloud services list --enabled` output.
3. **The Artifact Registry repository exists.**
   Evidence: `gcloud artifacts repositories list`.
4. **The Cloud SQL instance and database both exist and are reachable.**
   Evidence: `gcloud sql instances describe` + a real connection attempt.

Corresponding Result/DoD (once filled): Artifact Registry repo `containers` exists in
the target region; Cloud SQL Postgres instance + database exist and accept a
connection; required APIs enabled with no missing-permission errors on later steps.

See `agent_doc/README.md` for the verdict scale and reporting format.
