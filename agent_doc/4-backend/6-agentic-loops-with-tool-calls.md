---
stage: 4-backend
step: 6
source: Hackathon Wiki/stages/4-backend/steps/6-agentic-loops-with-tool-calls.md
---

# Validator — 6. Agentic Loops with Tool Calls

Checks: `Hackathon Wiki/stages/4-backend/steps/6-agentic-loops-with-tool-calls.md`.

## What this step is proving

An agentic (tool-calling) WCS evaluation run actually happened — not just the step-5
single-shot baseline — and its result was explicitly compared against that baseline,
with a concrete, nameable improvement.

## Evidence to gather

- The agentic run invocation (e.g. `npx wcs eval --mcp --runner gemini-cli ...`) and
  its report.
- The step-5 baseline report, for side-by-side comparison.
- A team note naming at least one thing the tool-calling loop fixed that the
  single-shot prompt didn't.

## Gate checklist

1. **One evaluation has run with an agentic (tool-calling) runner, not just
   single-shot.**
   Evidence: the agentic run's report/log.
2. **Its score is compared against the step 5 baseline, not run in isolation.**
   Evidence: a side-by-side comparison note or diff.
3. **The team can name at least one thing the tool-calling loop fixed that the
   single-shot prompt didn't.**
   Evidence: the specific named fix, cross-checked against the baseline report's
   failures.

Corresponding Result/DoD (once filled): an agentic (MCP-tool) eval run completes and
produces a score; that score/behavior is compared explicitly against the step-5
baseline run.

See `agent_doc/README.md` for the verdict scale and reporting format.
