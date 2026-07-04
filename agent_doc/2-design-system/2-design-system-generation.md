---
stage: 2-design-system
step: 2
source: Hackathon Wiki/stages/2-design-system/steps/2-design-system-generation.md
---

# Validator — 2. Design System Generation

Checks: `Hackathon Wiki/stages/2-design-system/steps/2-design-system-generation.md`.

## What this step is proving

A first-pass design system (tokens, spacing, type scale, base components) was generated
in Google Stitch from a tone/flow description, not iterated indefinitely, and the
exported Angular code was actually verified to render — not just previewed in Stitch's
canvas.

## Evidence to gather

- The written tone/flow description used to prompt Stitch.
- The Stitch project's generated output (color tokens, spacing scale, type scale, base
  components).
- The exported Angular code in the repo.
- A screenshot or live-render proof (e.g. from Antigravity's Browser Subagent or a
  manual browser check) that the exported code actually renders.
- Iteration count/history in the Stitch project.

## Gate checklist

1. **One tone/flow description exists before generation starts.**
   Evidence: the written description, dated/ordered before the first generation.
2. **Output includes color tokens, a spacing scale, a type scale, and at least one base
   component.**
   Evidence: Stitch project output or exported code. Fail if any piece is missing.
3. **Generation was not iterated more than twice.**
   Evidence: Stitch project iteration history.
4. **The exported Angular code was verified to actually render** (screenshot or live
   render), not assumed from the Stitch canvas preview alone.
   Evidence: a render proof distinct from the Stitch canvas preview itself. Fail if the
   only evidence of correctness is the Stitch preview.

See `agent_doc/README.md` for the verdict scale and reporting format.
