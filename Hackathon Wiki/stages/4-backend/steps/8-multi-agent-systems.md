---
stage: 4-backend
task: 8
---

# 8. Multi-Agent Systems

**What to do:** Split one monolithic "generate the whole thing" agent into distinct roles — planner, writer, fixer — each with its own scoped context.

**How:**
1. **Planner:** one call that reads the task + guidance partials (step 7) and outputs a concise checklist of the specific conventions this task must follow — no code, just rules.
2. **Writer:** one call that implements the complete feature following the planner's checklist exactly.
3. **Fixer:** a fresh, isolated call per failing check — handed only the specific failing findings, the affected file(s), the matching guidance partial, and a short "already tried" ledger (not the whole growing conversation history).
4. Run fix-until-green per gate (e.g. lint → build → accessibility), not a fixed round budget — stop only when a gate is clean or a fix stops changing anything (no-progress), and cap total fixes as a runaway backstop only.

**Recommended tool:** Write directly, following the confirmed planner/writer/fixer pattern in `wcs-edd/agents/workflow-gated-agent.runner.mjs`.

## Gate

- [ ] Planning, writing, and fixing are separate calls/roles, not one agent doing everything in one pass.
- [ ] Each fixer call gets a tight, isolated brief — not the entire prior conversation.
- [ ] The fix loop is governed by convergence (gate clean, or no more progress), with a hard cap only as a backstop, not the primary stop condition.

Last task — once it passes, the stage is done.

## Result

**Scope:** Split code generation for one real feature into planner → writer → fixer roles, with gated fix-until-green loops instead of one long single-agent conversation.

**DoD:**
- [ ] Planner, writer, and fixer are implemented (or explicitly adopted as a workflow) as separate, isolated-context calls.
- [ ] At least one gate (lint or build) runs fix-until-green and is verified to converge on a real task.

**Layers:** tooling: multi-agent harness; backend/frontend: whichever feature was used to exercise it.
