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

1. Copy the env template and fill in a real Gemini API key:

   ```
   cp .env.example .env
   ```

   `GOOGLE_API_KEY` is required for the `adk-agents` service to call Gemini — get one
   at https://ai.google.dev/gemini-api/docs/api-key. Without it, every other service
   still comes up fine, but `/api/solve` requests will fail at the Gemini call.

2. Build and start everything:

   ```
   docker compose up --build
   ```

3. Once healthy:
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:3000/api`
   - MCP server: `http://localhost:8000/mcp`
   - ADK agent API: `http://localhost:8081`
   - Ollama embeddings: `http://localhost:11434`

   `backend-api` runs `prisma db push` automatically on startup, so the schema is
   created in the `postgres` container with no manual migration step.

If any of those host ports are already in use by something else on your machine,
override them locally with a `docker-compose.override.yml` (already ignored by git),
e.g.:

```yaml
services:
  backend-api:
    ports:
      - '3001:3000'
```

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