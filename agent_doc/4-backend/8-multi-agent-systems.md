---
stage: 4-backend
step: 8
source: Hackathon Wiki/stages/4-backend/steps/8-multi-agent-systems.md
---

# Validator — 8. Multi-Agent Systems

Checks: `Hackathon Wiki/stages/4-backend/steps/8-multi-agent-systems.md`.

Last step of stage 4 — once it passes, the stage is done.

## What this step is proving

Code generation was actually split into planner / writer / fixer roles as separate,
isolated-context calls (not one agent doing everything in one pass), with each fixer
call scoped to a tight brief, and the fix loop governed by convergence (gate clean, or
no more progress) rather than a fixed round count.

## Evidence to gather

- The implementation, e.g. `wcs-edd/agents/workflow-gated-agent.runner.mjs` (or
  whatever the team actually built/adopted), checked for distinct
  planner/writer/fixer call boundaries.
- A fixer call's actual input payload — confirm it's the failing findings + affected
  file(s) + matching guidance partial + a short "already tried" ledger, not the full
  conversation history.
- A real run's log showing a fix-until-green loop terminating on a clean gate or a
  no-progress condition, with any round cap acting only as a backstop (not the reason it
  stopped in a successful run).

## Gate checklist

1. **Planning, writing, and fixing are separate calls/roles, not one agent doing
   everything in one pass.**
   Evidence: implementation structure.
2. **Each fixer call gets a tight, isolated brief — not the entire prior
   conversation.**
   Evidence: actual fixer call payload/prompt.
3. **The fix loop is governed by convergence (gate clean, or no more progress), with a
   hard cap only as a backstop, not the primary stop condition.**
   Evidence: run log showing why the loop actually stopped.

Corresponding Result/DoD (once filled): planner, writer, fixer implemented (or
explicitly adopted as a workflow) as separate isolated-context calls; at least one gate
(lint or build) runs fix-until-green and is verified to converge on a real task.

See `agent_doc/README.md` for the verdict scale and reporting format.
