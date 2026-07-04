# Hackathon Step Validators

One validator spec per step defined in `Hackathon Wiki/stages/*/steps/*.md`, mirroring
that folder structure 1:1 (`agent_doc/<stage>/<step>.md` ↔
`Hackathon Wiki/stages/<stage>/steps/<step>.md`).

These are **report-only specs**, not executable agents. Each one tells whoever (human
or AI) is validating a step exactly what evidence to look for and how to score the
step's own Gate checklist against that evidence. Nothing here edits the wiki — the
Gate/Result sections in `Hackathon Wiki` stay the team's/AI's to fill in per `START.md`'s
own rules.

## How to use one

1. Open the matching wiki step file (linked at the top of each validator) to see the
   full Task/Gate/Result context.
2. Work through the validator's **Evidence to gather** list against the real repo,
   running app, deployed infra, or team's own records — not assumptions.
3. Score each **Gate checklist** item using the scale below.
4. Give one overall verdict for the step.

## Verdict scale

- **PASS** — evidence directly confirms the item is true.
- **FAIL** — evidence directly contradicts the item (say what was found instead).
- **UNKNOWN** — no evidence either way could be found (say what you looked for and
  where, so the gap is actionable, not just "unclear").

Overall step verdict:
- **PASS** — every Gate item is PASS.
- **FAIL** — at least one Gate item is FAIL (list which).
- **INCOMPLETE** — no FAILs, but at least one item is UNKNOWN.

Some Gate items are process/judgment calls that can't be checked from repo evidence
alone (e.g. "the silent round happened before discussion," "everyone rehearsed the
pitch"). Those are flagged in the relevant validator as **team self-report** — take the
team's word for it rather than searching for evidence that can't exist in the repo.

## Index

### 1-discovery
- [1-idea](1-discovery/1-idea.md)
- [2-persona](1-discovery/2-persona.md)
- [3-problem-statement](1-discovery/3-problem-statement.md)
- [4-process-map](1-discovery/4-process-map.md)
- [5-mvp-scope](1-discovery/5-mvp-scope.md)
- [6-kanban](1-discovery/6-kanban.md)

### 2-design-system
- [1-accessibility-checklist](2-design-system/1-accessibility-checklist.md)
- [2-design-system-generation](2-design-system/2-design-system-generation.md)
- [3-figma-sync](2-design-system/3-figma-sync.md)
- [4-design-tokens-component-anatomy](2-design-system/4-design-tokens-component-anatomy.md)
- [5-mcp-server-connection](2-design-system/5-mcp-server-connection.md)
- [6-ai-agent-component-generation](2-design-system/6-ai-agent-component-generation.md)

### 3-frontend-arch
- [1-nx-dependency-graph](3-frontend-arch/1-nx-dependency-graph.md)
- [2-standalone-component](3-frontend-arch/2-standalone-component.md)
- [3-signal-state](3-frontend-arch/3-signal-state.md)
- [4-ng-diagram-interactive-diagram](3-frontend-arch/4-ng-diagram-interactive-diagram.md)
- [5-chrome-devtools-mcp-and-modern-web-guidance](3-frontend-arch/5-chrome-devtools-mcp-and-modern-web-guidance.md)

### 4-backend
- [1-nestjs-feature-module](4-backend/1-nestjs-feature-module.md)
- [2-api-contract-swagger-cors-validation](4-backend/2-api-contract-swagger-cors-validation.md)
- [3-docker-sequelize-postgres](4-backend/3-docker-sequelize-postgres.md)
- [4-frontend-backend-contract](4-backend/4-frontend-backend-contract.md)
- [5-evaluation-scoreboards](4-backend/5-evaluation-scoreboards.md)
- [6-agentic-loops-with-tool-calls](4-backend/6-agentic-loops-with-tool-calls.md)
- [7-context-engineering](4-backend/7-context-engineering.md)
- [8-multi-agent-systems](4-backend/8-multi-agent-systems.md)

### 5-deployment
- [1-gcp-foundation](5-deployment/1-gcp-foundation.md)
- [2-custom-mcp-server-pytriz](5-deployment/2-custom-mcp-server-pytriz.md)
- [3-cloud-build-artifact-registry-cloud-run](5-deployment/3-cloud-build-artifact-registry-cloud-run.md)
- [4-cloud-sql-connection](5-deployment/4-cloud-sql-connection.md)
- [5-observability-cloud-logging](5-deployment/5-observability-cloud-logging.md)

### 6-ship
- [1-assemble-wire-services](6-ship/1-assemble-wire-services.md)
- [2-production-smoke-test](6-ship/2-production-smoke-test.md)
- [3-demo-script-and-pitch](6-ship/3-demo-script-and-pitch.md)
- [4-ship-checklist](6-ship/4-ship-checklist.md)
