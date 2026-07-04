---
stage: 5-deployment
task: 1
---

# 1. GCP Foundation

**What to do:** Set up the Google Cloud project once — APIs, container registry, and the Cloud SQL instance — before deploying anything.

**How:**
1. Set the active project and region: `gcloud config set project $GCP_PROJECT`, `gcloud config set run/region $REGION`.
2. Enable the required APIs in one call: `run`, `cloudbuild`, `artifactregistry`, `sqladmin`, `secretmanager` (add `aiplatform`/`compute` if the product calls Vertex AI).
3. Create the Artifact Registry repository once: `gcloud artifacts repositories create containers --repository-format=docker --location=$REGION`.
4. Create the Cloud SQL Postgres instance (takes 4-6 minutes) and its database: `gcloud sql instances create <name> --database-version=POSTGRES_15 --tier=db-f1-micro --region=$REGION`, then `gcloud sql databases create <db-name> --instance=<name>`.
5. If on a corporate/managed GCP org, apply the `run.allowedMembers` / `iam.allowedPolicyMemberDomains` policy bypass so Cloud Run services can be deployed with `--allow-unauthenticated`.

**Recommended tool:** `gcloud` CLI. Reference: `stages/5-deployment/gdg-mcp-workshop/GCP Deploy Windows 11.md` (full verified PowerShell commands) and `hackathon-cloud-prep/Makefile` for the equivalent make targets.

## Gate

- [ ] `gcloud config get-value project` returns the correct project.
- [ ] All required APIs show as enabled (`gcloud services list --enabled`).
- [ ] The Artifact Registry repository exists.
- [ ] The Cloud SQL instance and database both exist and are reachable.

Next: [[2-custom-mcp-server-pytriz]].

## Result

**Scope:** Provision the GCP foundation (APIs, Artifact Registry, Cloud SQL instance + database) that every later deployment step depends on.

**DoD:**
- [ ] Artifact Registry repo `containers` exists in the target region.
- [ ] Cloud SQL Postgres instance + database exist and accept a connection.
- [ ] Required APIs are enabled with no missing-permission errors on later steps.

**Layers:** infra: GCP project setup, Artifact Registry, Cloud SQL.
