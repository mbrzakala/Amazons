# Chunk 16 — Reasoning Trail Diagram (ng-diagram Setup + Data Binding)

## Depends on
Chunk 03 (`ng-diagram` installed, real API recorded in `doc/ng-diagram-api-notes.md` — **use the real names from that file, not the placeholder names below if they differ**), chunk 09 (`SolveSessionService`), chunk 11 (fake data layer's `reasoningTrail: {nodes, edges}` shape).

## Context recap
Per `wireframe_evaluation_ngd_trail/code.html`: a directed graph — **Problem Root** (top, single node) → 3 **Reformulation** nodes (A/B/C — note: only 2 methods exist in this app, TRIZ + one other; if the real data only produces 2 reformulation nodes, that's correct, don't pad to 3 just to match the wireframe's illustrative screenshot) → candidate/solution nodes (one visually the winning path — filled `--color-primary` background) → 1 terminal **Final Recommendation** node (2px primary border, bold). Connectors are **orthogonal (elbow) 1px lines only** — no curved paths, per the design system. A small legend (Node/Step/Connection) and a faint dot-grid background complete the "schematic" look.

## Task
1. On the reasoning-trail host component (a new `apps/frontend/src/app/features/evaluation-trail/reasoning-trail/`), register the diagram provider function exactly as named in `doc/ng-diagram-api-notes.md` in this component's `providers` array (not app-wide). Import the diagram library's stylesheet globally in `apps/frontend/src/styles.scss` (not component-level), per that same notes file.
2. Build custom node templates for each node type (Problem Root, Reformulation, Candidate/Solution, Final Recommendation) styled per tokens — rounded-rect, no shadows, `--color-primary` fill for the winning-path candidate and the final node.
3. Using the model-service method names confirmed in chunk 03's notes (`updateNodes([...])`/`updateEdges([...])` or their real equivalents), build the node/edge arrays from `SolveSessionService`'s data: problem → both reformulations → each method's solutions → the single recommended solution → final recommendation node. Use **batch** updates, not a loop of individual single-node calls.
4. Implement orthogonal edge routing per chunk 03's findings — either native config or the custom-renderer approach that chunk 03 identified as necessary.
5. Add the legend and dot-grid background as static presentational elements (no diagram-library involvement needed for these).

## Files to create/modify
- `apps/frontend/src/app/features/evaluation-trail/reasoning-trail/` (new)
- `apps/frontend/src/styles.scss` (global diagram stylesheet import added)

## Out of scope
- Do not build the Evaluation Table (chunk 15, already done) or the rest of Screen C's layout (chunk 17).
- Do not mutate the diagram's node/edge arrays directly anywhere — every write goes through the model service method from chunk 03's notes.

## Definition of done
- [ ] Diagram renders live with real data from `SolveSessionService`, not a hardcoded static example.
- [ ] All node/edge writes go through the model service's batch update methods — grep confirms no direct array mutation.
- [ ] Connectors are orthogonal/elbow, verified visually — no curves.
- [ ] The stylesheet import is in `styles.scss` (global), not inside this component's own style file.

## Handoff
Chunk 17 places this component into the full Evaluation screen alongside the table from chunk 15.
