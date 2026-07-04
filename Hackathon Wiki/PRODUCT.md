# PRODUCT — fixed facts (do not relitigate)

Facts here are constraints, not decisions. A session that wants to change one must get
explicit human sign-off and log the change in the owning stage's `## Superseded`.

## Pipeline

Claude (Cowork) gathers intelligence and plans → Devin (IDE) executes. This wiki is the
persistent context layer between their stateless sessions. Single-use artifacts (task
lists, one-off specs) pass directly from Claude to Devin and are NOT stored here.

## Stack (fixed by the event format)

- Nx monorepo
- Frontend: Angular, signal-based state; ng-diagram for diagramming
- Backend: NestJS + Sequelize + OpenAPI/Swagger; DB via Docker locally
- Debugging: Chrome DevTools MCP
- Design handoff: Google Stitch (code export incl. Angular; ships its own MCP server) +
  Antigravity for browser-verified generation — Figma optional, not required (see stage
  2 step 3, superseded 2026-07-04)
- CI/CD: Cloud Build + Artifact Registry
- Deploy: Google Cloud Run (frontend, backend, MCP server) + Cloud SQL; Cloud Logging
- Optimization: custom MCP server (TRIZ / pytriz)

## Repos

- Prep/practice workspace: `build-with-ai-hackathon-preparation` (Nx, Angular)
- Product repo: _(set when the challenge is assigned — then commit this wiki into it as `/wiki`)_

## Process method

Discovery uses **Event Storming** (not BPMN) for process modeling.
