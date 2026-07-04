---
stage: 2-design-system
step: 3
source: Hackathon Wiki/stages/2-design-system/steps/3-figma-sync.md
---

# Validator — 3. Stitch Project as the Source of Truth

Checks: `Hackathon Wiki/stages/2-design-system/steps/3-figma-sync.md`.

Note: this step was superseded 2026-07-04 (Figma-first → Stitch-first). Validate
against the current text, not the original Figma-sync intent.

## What this step is proving

The team is treating one continuous Stitch project as the design system's source of
truth, and did not add Figma unless they hit a specific, named gap in Stitch's
coverage.

## Evidence to gather

- The Stitch project link/reference used across iterations (should be the same project
  each time, not a fresh generation).
- Any Figma file created during the hackathon, plus whatever justification is recorded
  for it.

## Gate checklist

1. **The team is iterating on one Stitch project, not regenerating from a blank canvas
   each time.**
   Evidence: Stitch project history/version count. Fail if multiple disconnected
   projects exist for the same product.
2. **Everyone knows this project is the current source of truth for the design
   system.**
   Evidence: team self-report, or references to "the Stitch project" in team
   notes/commits when a design question comes up.
3. **Figma was not added unless a specific, named gap in Stitch's coverage was actually
   hit.**
   Evidence: if a Figma file exists, check for a recorded reason (a named gap). Fail if
   Figma exists with no such reason on record.

See `agent_doc/README.md` for the verdict scale and reporting format.
