---
stage: 3-frontend-arch
task: 4
---

# 4. ng-diagram Interactive Diagram

**What to do:** Decide whether the product needs an interactive node-and-edge diagram (workflow builder, process visualizer, org chart) — and if so, build it with `ng-diagram`, not a hand-rolled canvas.

**How:**
1. Confirm this is actually needed. If the product is a plain CRUD/forms app, skip this step entirely — don't force a diagram UI in.
2. If needed, read the three local reference docs before writing any diagram code: `best-practices/ng-diagrams/00-overview.md`, `.../02-node-templates.md`, `.../07-golden-rules.md`.
3. Install `ng-diagram` and import its stylesheet **globally** in `styles.scss` (never at the component level — component-level imports don't apply CSS custom-property overrides to the right scope).
4. Every component hosting `<ng-diagram>` must declare `provideNgDiagram()` in its own `providers` array, and all node/edge writes must go through `NgDiagramModelService` — never mutate `model.nodes`/`model.edges` directly.

**Recommended tool:** `ng-diagram` package, documented locally in `best-practices/ng-diagrams/` (8 reference files) plus a working tutorial project at `ngd-build-with-ai/02-project`. Backup: the `ngd-build-with-ai/01-tutorial` static site for step-by-step examples; a static SVG/Mermaid diagram instead of an interactive one if time runs out — an acceptable scope cut, not a blocker.

## Gate

- [ ] The team confirmed the product genuinely needs an interactive diagram before starting this step (or explicitly skipped this step).
- [ ] The stylesheet is imported globally in `styles.scss`, not inside a component.
- [ ] Every diagram-hosting component has `provideNgDiagram()` in its `providers`.
- [ ] All node/edge changes go through `NgDiagramModelService` methods — no direct mutation of the model array.

Next: [[5-chrome-devtools-mcp-and-modern-web-guidance]].

## Result

**Scope:** Render one working interactive diagram (nodes + edges) for the part of the product that needs it, using `ng-diagram` per the local golden rules. Skip this Result if the step itself was skipped as not needed.

**DoD:**
- [ ] `provideNgDiagram()` is present on the hosting component and the global stylesheet is imported correctly.
- [ ] At least one node type and one edge render correctly and can be updated via `NgDiagramModelService` (not direct mutation).
- [ ] Batch updates use `updateNodes([...])`/`updateEdges([...])`, not a loop of single updates.

**Layers:** frontend: components, ng-diagram integration.
