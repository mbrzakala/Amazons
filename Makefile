# ==========================================================================
# Amazons - Workshop GCP Step-by-Step Deployment Makefile
# ==========================================================================

# Configuration Variables (Participants should override these)
GCP_PROJECT   ?= gen-lang-client-0338633763
REGION        ?= europe-west1
REGISTRY_NAME ?= amazons-repo
DB_INSTANCE   ?= amazons-db
DB_USER       ?= postgres
DB_PASSWORD   ?= inventapassword
DB_NAME       ?= amazons

# Full Image Paths
REGISTRY_URL     = $(REGION)-docker.pkg.dev/$(GCP_PROJECT)/$(REGISTRY_NAME)
EMBEDDINGS_IMAGE = $(REGISTRY_URL)/amazons-embeddings:latest
MCP_IMAGE        = $(REGISTRY_URL)/amazons-mcp-server:latest
AGENT_IMAGE      = $(REGISTRY_URL)/amazons-adk-agent:latest
BACKEND_IMAGE    = $(REGISTRY_URL)/amazons-backend:latest
FRONTEND_IMAGE   = $(REGISTRY_URL)/amazons-frontend:latest

.PHONY: help install-tools install-deps gcp-init gcp-enable-apis gcp-create-registry gcp-create-db build-embeddings build-mcp build-agent build-backend build-frontend build-all deploy-embeddings deploy-mcp deploy-agent deploy-backend deploy-frontend show-urls gcp-cleanup

help:
	@echo "=========================================================================="
	@echo "🌀 AMAZONS - HACKATHON DEPLOYMENT MENU"
	@echo "=========================================================================="
	@echo "Prerequisites & Local Tooling Setup:"
	@echo "  make install-tools     (Install 'uv' package manager automatically)"
	@echo "  make install-deps      (Install all Node and Python dependencies)"
	@echo ""
	@echo "Configure GCP credentials and project:"
	@echo "  make gcp-init GCP_PROJECT=your-project-id"
	@echo ""
	@echo "Step 1: Enable Google APIs:"
	@echo "  make gcp-enable-apis"
	@echo ""
	@echo "Step 2: Create Artifact Registry:"
	@echo "  make gcp-create-registry"
	@echo ""
	@echo "Step 3: Spin up Cloud SQL PostgreSQL (Required by the NestJS backend):"
	@echo "  make gcp-create-db"
	@echo ""
	@echo "Step 4: Build individual services (Cloud Build):"
	@echo "  make build-embeddings  (Build Ollama Embeddings Service)"
	@echo "  make build-mcp         (Build TRIZ MCP Server)"
	@echo "  make build-agent       (Build Google ADK Agent)"
	@echo "  make build-backend     (Build NestJS Backend API)"
	@echo "  make build-frontend    (Build Angular Frontend)"
	@echo "  make build-all         (Build all five services)"
	@echo ""
	@echo "Step 5: Deploy containers one-by-one to Cloud Run:"
	@echo "  make deploy-embeddings (Ollama Embeddings Service)"
	@echo "  make deploy-mcp        (TRIZ MCP Server connected to Embeddings)"
	@echo "  make deploy-agent      (Google ADK Agent connected to MCP Server)"
	@echo "  make deploy-backend    (NestJS Backend connected to Agent + Cloud SQL)"
	@echo "  make deploy-frontend   (Angular Frontend served via Nginx)"
	@echo ""
	@echo "Utility Targets:"
	@echo "  make show-urls         (Retrieve URLs of deployed Cloud Run services)"
	@echo "=========================================================================="

# Install uv package manager dynamically depending on OS
install-tools:
	@echo "Detecting OS for 'uv' package manager installation..."
	@if [ "$$(uname)" = "Darwin" ] || [ "$$(uname)" = "Linux" ]; then \
		echo "Installing uv for Linux/macOS..."; \
		curl -LsSf https://astral.sh/uv/install.sh | sh; \
	elif [ "$$(expr substr $$(uname -s) 1 10)" = "MINGW32_NT" ] || [ "$$(expr substr $$(uname -s) 1 10)" = "MINGW64_NT" ]; then \
		echo "Installing uv for Windows (PowerShell)..."; \
		powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"; \
	else \
		echo "Unsupported OS for automatic install. Please install 'uv' manually from https://github.com/astral-sh/uv"; \
	fi

# Install Node & Python dependencies
install-deps:
	@echo "Installing python packages for mcp-server..."
	cd apps/backend/mcp-server && uv sync
	@echo "Installing python packages for adk-agents..."
	cd apps/backend/adk-agents && uv sync
	@echo "Installing global monorepo NPM dependencies..."
	npm install --legacy-peer-deps
	@echo "Generating local Prisma client models..."
	npx prisma generate --schema=apps/backend/backend-api/prisma/schema.prisma

# Authenticate & set current active project
gcp-init:
	gcloud auth login
	gcloud config set project $(GCP_PROJECT)

# Enable all required APIs
gcp-enable-apis:
	gcloud services enable \
		artifactregistry.googleapis.com \
		run.googleapis.com \
		sqladmin.googleapis.com \
		compute.googleapis.com \
		cloudbuild.googleapis.com \
		aiplatform.googleapis.com

# Create Artifact Registry Repository for Docker images
gcp-create-registry:
	gcloud artifacts repositories create $(REGISTRY_NAME) \
		--repository-format=docker \
		--location=$(REGION) \
		--description="Amazons Docker Repository"

# Provision a production-grade Cloud SQL instance
gcp-create-db:
	@echo "Provisioning Cloud SQL (PostgreSQL)... This will take a few minutes."
	gcloud sql instances create $(DB_INSTANCE) \
		--database-version=POSTGRES_15 \
		--tier=db-f1-micro \
		--region=$(REGION) \
		--root-password=$(DB_PASSWORD)
	@echo "Creating Database $(DB_NAME)..."
	gcloud sql databases create $(DB_NAME) --instance=$(DB_INSTANCE)

# ==========================================================================
# Individual Container Build Targets (Cloud Build)
# ==========================================================================

build-embeddings:
	gcloud builds submit --config=build-embeddings.yaml --project=$(GCP_PROJECT) --substitutions=_REGION=$(REGION),_REGISTRY_NAME=$(REGISTRY_NAME)

build-mcp:
	gcloud builds submit --config=build-mcp.yaml --project=$(GCP_PROJECT) --substitutions=_REGION=$(REGION),_REGISTRY_NAME=$(REGISTRY_NAME)

build-agent:
	gcloud builds submit --config=build-agent.yaml --project=$(GCP_PROJECT) --substitutions=_REGION=$(REGION),_REGISTRY_NAME=$(REGISTRY_NAME)

build-backend:
	gcloud builds submit --config=build-backend.yaml --project=$(GCP_PROJECT) --substitutions=_REGION=$(REGION),_REGISTRY_NAME=$(REGISTRY_NAME)

build-frontend:
	gcloud builds submit --config=build-frontend.yaml --project=$(GCP_PROJECT) --substitutions=_REGION=$(REGION),_REGISTRY_NAME=$(REGISTRY_NAME)

build-all: build-embeddings build-mcp build-agent build-backend build-frontend

# ==========================================================================
# Deployment Targets (Cloud Run)
# ==========================================================================

# Deploy Ollama Embeddings Service
deploy-embeddings:
	gcloud run deploy amazons-embeddings \
		--image=$(EMBEDDINGS_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--allow-unauthenticated \
		--memory=4Gi \
		--cpu=2 \
		--min-instances=1

# Deploy TRIZ MCP Server (connected to Embeddings)
deploy-mcp:
	@echo "Fetching private Embeddings URL..."
	$(eval EMBEDDINGS_URL := $(shell gcloud run services describe amazons-embeddings --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy amazons-mcp-server \
		--image=$(MCP_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--ingress=all \
		--allow-unauthenticated \
		--memory=2Gi \
		--min-instances=1 \
		--set-env-vars=MCP_HOST=0.0.0.0,MCP_PORT=8080,EMBEDDING_SERVICE_URL=$(EMBEDDINGS_URL)/v1,EMBEDDING_MODEL=embeddinggemma:300m,EMBEDDING_API_KEY=ollama

# Deploy Google ADK Agent (connected to MCP Server)
# GOOGLE_API_USE_CLIENT_CERTIFICATE=false makes the TRIZ agent's MCP toolset skip
# the ADC/mTLS client-certificate handshake against the plain-HTTP MCP server;
# without it, TRIZ tools can silently fail to load, degrading to a toolless
# answer with no reasoning trail.
deploy-agent:
	@echo "Fetching private MCP Server URL..."
	$(eval MCP_URL := $(shell gcloud run services describe amazons-mcp-server --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy amazons-adk-agent \
		--image=$(AGENT_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--ingress=all \
		--allow-unauthenticated \
		--memory=2Gi \
		--min-instances=1 \
		--set-env-vars=MCP_SERVER_URL=$(MCP_URL)/mcp,GOOGLE_GENAI_USE_VERTEXAI=1,GOOGLE_CLOUD_PROJECT=$(GCP_PROJECT),GCP_PROJECT=$(GCP_PROJECT),GOOGLE_API_USE_CLIENT_CERTIFICATE=false

# Deploy NestJS Backend (connected to ADK Agent + Cloud SQL)
deploy-backend:
	@echo "Fetching private ADK Agent URL..."
	$(eval AGENT_URL := $(shell gcloud run services describe amazons-adk-agent --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy amazons-backend \
		--image=$(BACKEND_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--allow-unauthenticated \
		--min-instances=1 \
		--add-cloudsql-instances=$(GCP_PROJECT):$(REGION):$(DB_INSTANCE) \
		--set-env-vars=DATABASE_URL="postgresql://$(DB_USER):$(DB_PASSWORD)@localhost:5432/$(DB_NAME)?host=/cloudsql/$(GCP_PROJECT):$(REGION):$(DB_INSTANCE)",ADK_AGENT_URL=$(AGENT_URL)

# Deploy Angular Frontend
# NOTE: the Angular app has no backend integration wired up yet (no /api calls)
# - this deploys a static shell, not a functional TRIZ UI. BACKEND_URL must be
# set or nginx.conf's envsubst leaves a literal ${BACKEND_URL} in proxy_pass,
# which fails nginx's config check and the container never starts.
deploy-frontend:
	@echo "Fetching private Backend URL..."
	$(eval BACKEND_URL := $(shell gcloud run services describe amazons-backend --region=$(REGION) --format='value(status.url)'))
	gcloud run deploy amazons-frontend \
		--image=$(FRONTEND_IMAGE) \
		--region=$(REGION) \
		--platform=managed \
		--allow-unauthenticated \
		--min-instances=1 \
		--set-env-vars=BACKEND_URL=$(BACKEND_URL)

# Retrieve active endpoints of deployed Cloud Run services
show-urls:
	@echo "=========================================================================="
	@echo "🌀 AMAZONS - ACTIVE GCP CLOUD RUN ENDPOINTS"
	@echo "=========================================================================="
	@echo "Frontend (Angular UI):"
	@gcloud run services describe amazons-frontend --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "Backend (NestJS API):"
	@gcloud run services describe amazons-backend --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "ADK Agent (Private Brain):"
	@gcloud run services describe amazons-adk-agent --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "MCP Server (TRIZ API):"
	@gcloud run services describe amazons-mcp-server --region=$(REGION) --format='value(status.url)'
	@echo ""
	@echo "Embeddings (Ollama Service):"
	@gcloud run services describe amazons-embeddings --region=$(REGION) --format='value(status.url)'
	@echo "=========================================================================="

# Tear down all deployed resources to avoid charges
gcp-cleanup:
	@echo "Deleting Cloud Run Services..."
	-gcloud run services delete amazons-frontend --region=$(REGION) --quiet
	-gcloud run services delete amazons-backend --region=$(REGION) --quiet
	-gcloud run services delete amazons-adk-agent --region=$(REGION) --quiet
	-gcloud run services delete amazons-mcp-server --region=$(REGION) --quiet
	-gcloud run services delete amazons-embeddings --region=$(REGION) --quiet
	@echo "Deleting Cloud SQL Instance $(DB_INSTANCE)..."
	-gcloud sql instances delete $(DB_INSTANCE) --quiet
	@echo "Deleting Artifact Registry $(REGISTRY_NAME)..."
	-gcloud artifacts repositories delete $(REGISTRY_NAME) --location=$(REGION) --quiet
	@echo "Takedown completed!"
