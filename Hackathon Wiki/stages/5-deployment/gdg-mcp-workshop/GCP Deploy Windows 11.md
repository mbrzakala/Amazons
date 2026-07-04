# GCP Deploy — Windows 11 (PowerShell)

Step-by-step guide for deploying the BuildWithAI stack to Google Cloud Run from a Windows 11 machine using PowerShell. Every command here has been verified on Windows 11 with PowerShell.

Related: [[SIMPLE - how to use]], [[How the Server Works]]

## Prerequisites

### 1. Install Google Cloud CLI

Download the Windows 64-bit installer from https://cloud.google.com/sdk/docs/install and run it with defaults.

The installer does NOT always add gcloud to PATH. If `gcloud --version` fails after install, add it manually:

```powershell
# Permanent fix (new sessions pick this up):
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin", "User")

# Session fix (works immediately, lost on close):
$env:PATH += ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"
```

After the permanent fix, open a new PowerShell window.

### 2. Install uv (Python package manager)

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Add to PATH (same pattern as gcloud):

```powershell
$env:PATH += ";$env:USERPROFILE\.local\bin"
```

### 3. Install Docker Desktop

Download from https://www.docker.com/products/docker-desktop/ and install. Required for local dry runs via Docker Compose.

### 4. Clone the repo and switch to gcp-deploy branch

```powershell
git clone https://github.com/mmysior/gdg-mcp-workshop.git
cd gdg-mcp-workshop
git checkout gcp-deploy
```

If you forked the repo, add upstream:

```powershell
git remote add upstream https://github.com/mmysior/gdg-mcp-workshop.git
git fetch upstream
git checkout gcp-deploy
```

## GCP Foundation

### Set variables (PowerShell syntax — NOT bash export)

```powershell
$env:GCP_PROJECT = "your-unique-project-id"
$env:REGION = "europe-west1"
$env:DB_PASSWORD = "inventapassword"
```

These are session-scoped. If you open a new terminal, set them again.

### Authenticate

```powershell
gcloud auth login
```

### Enable APIs

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com aiplatform.googleapis.com compute.googleapis.com --project=$env:GCP_PROJECT
```

### Create Artifact Registry

```powershell
gcloud artifacts repositories create containers --repository-format=docker --location=$env:REGION --project=$env:GCP_PROJECT
```

### Create Cloud SQL instance (4-6 minutes)

```powershell
gcloud sql instances create buildwithai-db --database-version=POSTGRES_15 --tier=db-f1-micro --region=$env:REGION --project=$env:GCP_PROJECT --root-password=$env:DB_PASSWORD
```

### Create database inside the instance

```powershell
gcloud sql databases create buildwithai --instance=buildwithai-db --project=$env:GCP_PROJECT
```

### Org policy bypass (only if corporate/managed GCP)

If you get `iam.allowedPolicyMemberDomains` or `run.allowedMembers` violations:

```powershell
@'
name: projects/your-unique-project-id/policies/run.allowedMembers
spec:
  rules:
  - allowAll: true
'@ | Set-Content policy.yaml

gcloud org-policies set-policy policy.yaml --project=$env:GCP_PROJECT

@'
name: projects/your-unique-project-id/policies/iam.allowedPolicyMemberDomains
spec:
  rules:
  - allowAll: true
'@ | Set-Content iam-policy.yaml

gcloud org-policies set-policy iam-policy.yaml --project=$env:GCP_PROJECT

Remove-Item policy.yaml, iam-policy.yaml
```

## Assembly Line — 4 Stages

Each stage: run locally, test locally, build container, deploy to Cloud Run.

The Makefile uses bash syntax (`export`, `cat <<EOF`) and is not usable in PowerShell. All commands below are PowerShell equivalents.

### Stage 1: TRIZ MCP Server

**Run locally:**

```powershell
cd mcp-server
$env:MCP_HOST = "0.0.0.0"
$env:MCP_PORT = "8000"
uv run python app/main.py
```

**Test locally** (second terminal — set PATH and uv again first):

The MCP server uses StreamableHTTP with sessions. A simple curl will not work. You need two calls:

```powershell
# 1. Initialize session
$response = curl.exe -s -D - -X POST http://localhost:8000/mcp -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -d '{\"jsonrpc\": \"2.0\", \"method\": \"initialize\", \"params\": {\"protocolVersion\": \"2024-11-05\", \"capabilities\": {}, \"clientInfo\": {\"name\": \"test\", \"version\": \"1.0\"}}, \"id\": 1}'
$sessionId = ($response -match 'mcp-session-id' | ForEach-Object { ($_ -split ': ')[1].Trim() })

# 2. List tools
curl.exe -X POST http://localhost:8000/mcp -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -H "Mcp-Session-Id: $sessionId" -d '{\"jsonrpc\": \"2.0\", \"method\": \"tools/list\", \"id\": 2}'
```

Expected: JSON listing 6 tools (`browse_contradiction_matrix`, `search_parameter`, `search_principle`, `get_random_principles`, `get_principle_by_id`, `get_parameter_by_id`).

Kill with `Ctrl+C` when done.

**Build container (Cloud Build):**

```powershell
cd "c:\google workshop\gdg-mcp-workshop"
gcloud builds submit --config=build-mcp.yaml
```

**Deploy to Cloud Run:**

```powershell
gcloud run deploy triz-mcp-server --image=europe-west1-docker.pkg.dev/$env:GCP_PROJECT/containers/triz-mcp-server:latest --region=$env:REGION --platform=managed --ingress=all --allow-unauthenticated --memory=2Gi --min-instances=1 --set-env-vars=MCP_HOST=0.0.0.0,MCP_PORT=8080
```

### Stage 2: ADK Agent

**Run locally (connected to cloud MCP):**

```powershell
cd adk-agents
$env:MCP_SERVER_URL = "https://triz-mcp-server-xxxx.a.run.app/mcp"
$env:ADK_API_BACKEND = "vertex"
$env:GOOGLE_GENAI_USE_VERTEXAI = "1"
$env:GOOGLE_CLOUD_PROJECT = $env:GCP_PROJECT
uv run adk api_server triz_agent --port 8081 --host 0.0.0.0
```

**Test locally:**

```powershell
curl.exe -s -X POST http://localhost:8081/apps/triz_agent/users/test/sessions/test-session -H "Content-Type: application/json" -d '{}'

curl.exe -X POST http://localhost:8081/run -H "Content-Type: application/json" -d '{\"appName\": \"triz_agent\", \"userId\": \"test\", \"sessionId\": \"test-session\", \"newMessage\": {\"role\": \"user\", \"parts\": [{\"text\": \"I want speed to improve (9) but memory degrades (23).\"}]}}'
```

**Build container:**

```powershell
cd "c:\google workshop\gdg-mcp-workshop"
gcloud builds submit --config=build-agent.yaml
```

**Deploy to Cloud Run:**

```powershell
$MCP_URL = gcloud run services describe triz-mcp-server --region=$env:REGION --format="value(status.url)"
gcloud run deploy triz-adk-agent --image=europe-west1-docker.pkg.dev/$env:GCP_PROJECT/containers/triz-adk-agent:latest --region=$env:REGION --platform=managed --ingress=all --allow-unauthenticated --memory=2Gi --min-instances=1 --set-env-vars="MCP_SERVER_URL=$MCP_URL/mcp,GOOGLE_GENAI_USE_VERTEXAI=1,GOOGLE_CLOUD_PROJECT=$env:GCP_PROJECT,GCP_PROJECT=$env:GCP_PROJECT"
```

### Stage 3: NestJS Backend

**Start Cloud SQL proxy (terminal 1):**

On Windows, download the proxy from https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.2/cloud-sql-proxy-windows-amd64.exe and run:

```powershell
.\cloud-sql-proxy.exe $env:GCP_PROJECT:$env:REGION:buildwithai-db --port 5432
```

**Run locally (terminal 2):**

```powershell
$env:DATABASE_URL = "postgresql://postgres:inventapassword@localhost:5432/buildwithai?schema=public"
$env:ADK_AGENT_URL = "https://triz-adk-agent-xxxx.a.run.app"
npx nx serve backend
```

**Test locally:**

```powershell
curl.exe -X POST http://localhost:3000/api/solve -H "Content-Type: application/json" -d '{\"problemDescription\": \"Test contradiction from localhost!\"}'
```

**Build container:**

```powershell
cd "c:\google workshop\gdg-mcp-workshop"
gcloud builds submit --config=build-backend.yaml
```

**Deploy to Cloud Run:**

```powershell
$AGENT_URL = gcloud run services describe triz-adk-agent --region=$env:REGION --format="value(status.url)"
gcloud run deploy buildwithai-backend --image=europe-west1-docker.pkg.dev/$env:GCP_PROJECT/containers/buildwithai-backend:latest --region=$env:REGION --platform=managed --allow-unauthenticated --min-instances=1 --add-cloudsql-instances="$env:GCP_PROJECT:$env:REGION:buildwithai-db" --set-env-vars="DATABASE_URL=postgresql://postgres:inventapassword@localhost:5432/buildwithai?host=/cloudsql/$env:GCP_PROJECT:$env:REGION:buildwithai-db,ADK_AGENT_URL=$AGENT_URL"
```

### Stage 4: Angular Frontend

**Run locally:**

```powershell
npx nx serve frontend
```

**Test locally:**

Open `http://localhost:4200`. Click the Settings gear, paste your deployed Backend URL, click Apply, submit a contradiction.

**Build container:**

```powershell
cd "c:\google workshop\gdg-mcp-workshop"
gcloud builds submit --config=build-frontend.yaml
```

**Deploy to Cloud Run:**

```powershell
$BACKEND_URL = gcloud run services describe buildwithai-backend --region=$env:REGION --format="value(status.url)"
gcloud run deploy buildwithai-frontend --image=europe-west1-docker.pkg.dev/$env:GCP_PROJECT/containers/buildwithai-frontend:latest --region=$env:REGION --platform=managed --allow-unauthenticated --min-instances=1 --set-env-vars="BACKEND_URL=$BACKEND_URL"
```

## Show All URLs

```powershell
Write-Host "Frontend:"
gcloud run services describe buildwithai-frontend --region=$env:REGION --format="value(status.url)"
Write-Host "Backend:"
gcloud run services describe buildwithai-backend --region=$env:REGION --format="value(status.url)"
Write-Host "ADK Agent:"
gcloud run services describe triz-adk-agent --region=$env:REGION --format="value(status.url)"
Write-Host "MCP Server:"
gcloud run services describe triz-mcp-server --region=$env:REGION --format="value(status.url)"
```

## Local Dry Run via Docker Compose

```powershell
# Add GOOGLE_API_KEY to .env (get from https://aistudio.google.com/)
docker compose up --build
```

Open `http://localhost` when ready.

## Cleanup

```powershell
gcloud run services delete buildwithai-frontend --region=$env:REGION --quiet
gcloud run services delete buildwithai-backend --region=$env:REGION --quiet
gcloud run services delete triz-adk-agent --region=$env:REGION --quiet
gcloud run services delete triz-mcp-server --region=$env:REGION --quiet
gcloud sql instances delete buildwithai-db --quiet
gcloud artifacts repositories delete containers --location=$env:REGION --quiet
```

## Windows 11 Gotchas

- **PATH not persisting**: `[Environment]::SetEnvironmentVariable(...)` only takes effect in new terminals. Use `$env:PATH +=` for the current session.
- **`export` doesn't work**: PowerShell uses `$env:VAR = "value"`, not `export VAR="value"`.
- **`curl` is aliased to `Invoke-WebRequest`**: Use `curl.exe` to call real curl. PowerShell's curl alias fails on `-H` and `-d` flags.
- **JSON escaping in curl.exe**: Single quotes around the body don't work. Use `\"` for inner quotes: `-d '{\"key\": \"value\"}'`.
- **`make` not available**: Windows doesn't ship with `make`. Use the gcloud commands directly (as documented above) or install via `winget install GnuWin32.Make`.
- **`cat <<EOF` doesn't work**: Use PowerShell here-strings: `@'...'@ | Set-Content file.yaml`.
- **MCP server session requirement**: The StreamableHTTP transport requires a session ID. A bare `curl` to `/mcp` returns "Missing session ID". Initialize first, extract the `Mcp-Session-Id` header, then send subsequent requests with that header.
- **Build YAMLs have hardcoded values**: The repo's `build-*.yaml` files contain `us-central1-docker.pkg.dev/r2d2-00/buildwithai-repo`. These must be updated to match your project, region, and registry name before `gcloud builds submit` will push to the right place.
- **DB instance name**: The Makefile expects `buildwithai-db`. If you created a differently named instance, either rename or update all deploy commands.
- **Docker Compose gcloud volume**: The `~/.config/gcloud` path is Linux. On Windows, use the Windows gcloud config path or mount `//c/Users/<user>/AppData/Roaming/gcloud`.
