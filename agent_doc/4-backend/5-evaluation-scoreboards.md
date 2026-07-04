---
stage: 4-backend
step: 5
source: Hackathon Wiki/stages/4-backend/steps/5-evaluation-scoreboards.md
---

# Validator — 5. Evaluation Scoreboards

Checks: `Hackathon Wiki/stages/4-backend/steps/5-evaluation-scoreboards.md`.

## What this step is proving

A deterministic baseline evaluation (web-codegen-scorer, "WCS") has been run and its
report actually opened and read — a real numeric score with a per-rating breakdown,
not an eyeballed quality judgment.

## Evidence to gather

- WCS installation/config and the `run-task.sh 0` (or `.ps1 0`) invocation record.
- The generated report: overall score, per-rating breakdown, and the generated app it
  scored.

## Gate checklist

1. **One baseline eval has been run and its report opened.**
   Evidence: the report file/output and confirmation it was reviewed, not just
   generated.
2. **The score is a number (0-100) with a per-rating breakdown, not a subjective
   judgment call.**
   Evidence: the report's structure.
3. **At least one failing rating (if any) is traced to the specific rule it
   violates.**
   Evidence: a note connecting a failing rating to its rule. N/A if the baseline run had
   zero failing ratings.

Corresponding Result/DoD (once filled): baseline eval (stage 0, single-shot prompt) ran
successfully and produced a report; score and per-rating breakdown recorded somewhere
comparable for future runs.

See `agent_doc/README.md` for the verdict scale and reporting format.
