---
stage: 4-backend
task: 5
---

# 5. Evaluation Scoreboards

**What to do:** Set up a deterministic scoreboard that scores AI-generated code against real rules, instead of eyeballing whether a generation "looks right."

**How:**
1. Install the scorer (`web-codegen-scorer`, "WCS") and set the model API key for the runner you'll use.
2. Run one baseline evaluation: a single task, a single model, deterministic ratings only (`./run-task.sh 0` on macOS/Linux/Git Bash, `.\run-task.ps1 0` on native PowerShell) — this is a single-shot generation with no tools, scored 0-100.
3. Open the generated report: the generated app, the per-rating breakdown (which specific rules passed/failed), and the overall score.
4. Treat each rating as a concrete, checkable rule (e.g. "uses signals, not decorators," "no `any` type") tied to a specific guidance partial — not a vague quality feeling.

**Recommended tool:** `web-codegen-scorer` (WCS) via the `run-task.sh`/`run-task.ps1` wrapper. Reference: `wcs-edd/README.md` for the quickstart, `wcs-edd/wiki/index.md` for how each guidance partial maps to the ratings that score it.

## Gate

- [ ] One baseline eval has been run and its report opened.
- [ ] The score is a number (0-100) with a per-rating breakdown, not a subjective judgment call.
- [ ] At least one failing rating (if any) is traced to the specific rule it violates.

Next: [[6-agentic-loops-with-tool-calls]].

## Result

**Scope:** Run one deterministic baseline evaluation of AI-generated code and read its scoreboard, establishing the number that has to go up for later iterations.

**DoD:**
- [ ] A baseline eval (stage 0, single-shot prompt) has run successfully and produced a report.
- [ ] The score and per-rating breakdown are recorded somewhere the team can compare future runs against.

**Layers:** tooling: evaluation harness, no app code changed.
