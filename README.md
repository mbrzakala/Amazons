# Amazons

This is hackathon solution

## Hackathon Requirements

- [Task](doc/hackathon_task.md)
- [Judging Criteria](doc/judging_criteria.md)
- [Deliverables](doc/deliverables.md)

## Running the Frontend

Install dependencies:

```
npm install
```

Start the dev server (with hot reload):

```
npx nx serve frontend
```

The app will be available at `http://localhost:4200`.

### Via Docker

Build and run the production nginx-served build (from the repo root, since the build context must include the whole Nx workspace):

```
docker build -f apps/frontend/Dockerfile -t frontend .
docker run --rm -p 8080:80 frontend
```

The app will be available at `http://localhost:8080`.

## Running the Full Stack Locally (Docker Compose)

`docker-compose.yml` at the repo root builds and runs every service: `postgres`,
`embeddings` (Ollama serving `embeddinggemma:300m`), `mcp-server` (TRIZ MCP server),
`adk-agents` (Google ADK agent), `backend-api` (NestJS), and `frontend` (nginx).

### Before you run it

1. **Docker Desktop (or the Docker Engine + Compose plugin) must be installed and running.**
   Check with `docker compose version`.

2. **Copy the env template and fill in a real Gemini API key:**

   ```
   cp .env.example .env
   ```

   `GOOGLE_API_KEY` is required for the `adk-agents` service to call Gemini — get one
   at https://ai.google.dev/gemini-api/docs/api-key. Without it, every other service
   still comes up fine, but `/api/solve` requests will fail at the Gemini call.

3. **Check that the ports below are free on your machine.** They're the defaults the
   compose file publishes; if another project (or an earlier `docker compose up`
   elsewhere) is already using one, the container for that service will sit stuck in
   `Created` state and never actually expose the port:

   ```
   lsof -nP -iTCP:3000 -iTCP:8000 -iTCP:8081 -iTCP:8080 -iTCP:11434 -sTCP:LISTEN
   ```

   If any of those are taken, don't change `docker-compose.yml` — instead add a
   `docker-compose.override.yml` at the repo root (already git-ignored, so it's
   local-only) remapping just the affected service(s), e.g.:

   ```yaml
   services:
     backend-api:
       ports:
         - '3001:3000'
     adk-agents:
       ports:
         - '8082:8081'
     mcp-server:
       ports:
         - '8001:8000'
     embeddings:
       ports:
         - '11435:8080'
   ```

   Compose auto-loads this file, so the URLs below shift to whatever host ports you
   chose.

### Run it

```
docker compose up --build
```

Once healthy:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000/api`
- MCP server: `http://localhost:8000/mcp`
- ADK agent API: `http://localhost:8081`
- Ollama embeddings: `http://localhost:11434`

`backend-api` runs `prisma db push` automatically on startup, so the schema is
created in the `postgres` container with no manual migration step.

## Kanban Board

We use a lightweight, Markdown-based Kanban board (`kanban-lite`) to track our hackathon progress and stages.

To view or manage the board from the command line:

```bash
npx kanban-lite list
```

To launch the interactive Kanban web UI (opens in browser at `http://localhost:3000`):

```bash
npx kanban-lite serve
```