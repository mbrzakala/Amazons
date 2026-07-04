---
stage: 3-frontend-arch
step: 4
source: Hackathon Wiki/stages/3-frontend-arch/steps/4-ng-diagram-interactive-diagram.md
---

# Validator — 4. ng-diagram Interactive Diagram

Checks: `Hackathon Wiki/stages/3-frontend-arch/steps/4-ng-diagram-interactive-diagram.md`.

## What this step is proving

Either the team confirmed the product genuinely needs an interactive node/edge diagram
and built it correctly with `ng-diagram` (global stylesheet import, `provideNgDiagram()`
per hosting component, all writes through `NgDiagramModelService`), or the team
explicitly skipped this step as not needed.

## Evidence to gather

- Team self-report / notes on whether an interactive diagram was judged necessary.
- `styles.scss` for the `ng-diagram` stylesheet import (global vs. component-level).
- Hosting components' `providers` arrays for `provideNgDiagram()`.
- Diagram-related code, grepped for direct `model.nodes`/`model.edges` mutation vs.
  `NgDiagramModelService` method calls (and `updateNodes([...])`/`updateEdges([...])`
  for batch updates).

## Gate checklist

1. **The team confirmed the product genuinely needs an interactive diagram before
   starting this step (or explicitly skipped this step).**
   Evidence: team note. If skipped, mark this Gate PASS and the rest N/A per the wiki's
   own instruction ("Skip this Result if the step itself was skipped as not needed").
2. **The stylesheet is imported globally in `styles.scss`, not inside a component.**
   Evidence: `styles.scss` vs. component-level style imports.
3. **Every diagram-hosting component has `provideNgDiagram()` in its `providers`.**
   Evidence: component decorators.
4. **All node/edge changes go through `NgDiagramModelService` methods — no direct
   mutation of the model array.**
   Evidence: grep for direct array mutation vs. service method calls.

Corresponding Result/DoD (once filled, only if not skipped): at least one node type and
one edge render and update correctly via `NgDiagramModelService`; batch updates use
`updateNodes([...])`/`updateEdges([...])`, not a loop of single updates.

See `agent_doc/README.md` for the verdict scale and reporting format.
