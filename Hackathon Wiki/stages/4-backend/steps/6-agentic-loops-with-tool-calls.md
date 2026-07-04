---
stage: 4-backend
task: 6
---

# 6. Agentic Loops with Tool Calls

**What to do:** Move from a single-shot prompt to an agent that calls tools (lint, build, serve) and iterates on its own output.

**How:**
1. Re-run the evaluation with an agentic runner instead of a single-shot one, e.g. `npx wcs eval --mcp --env env/config.s4.mjs --runner gemini-cli --model gemini-2.5-flash --prompt-filter <task>` — this gives the model MCP tools (Angular tooling) instead of one prompt-in, code-out call.
2. Compare the agentic run's score against the step 5 baseline — the loop should catch and fix issues a single shot couldn't.
3. Look at the progression of agent runners in `wcs-edd/agents/` (single-tool → advanced-tool → verify → workflow-agent) to see how loop complexity increases: more tools, then a verify-and-fix cycle, then a full multi-step workflow.

**Recommended tool:** WCS's `--mcp --runner gemini-cli` mode. Reference: `wcs-edd/agents/agent-single-tool.runner.mjs` and `agent-advanced-tool.runner.mjs` for the simplest tool-calling loops.

## Gate

- [ ] One evaluation has run with an agentic (tool-calling) runner, not just single-shot.
- [ ] Its score is compared against the step 5 baseline, not run in isolation.
- [ ] The team can name at least one thing the tool-calling loop fixed that the single-shot prompt didn't.

Next: [[7-context-engineering]].

## Result

**Scope:** Run one evaluation through a tool-calling agent loop and confirm it measurably improves on the single-shot baseline.

**DoD:**
- [ ] An agentic (MCP-tool) eval run completes and produces a score.
- [ ] The score/behavior is compared explicitly against the step 5 baseline run.

**Layers:** tooling: agent harness, no app code changed.
