# Chunk 13 — SolutionCard & SolutionStack Components

## Depends on
Chunk 05 (`StatusChip`), chunk 01 (tokens). (Does not need `Card` from chunk 04 — the wireframe's solution cards are a simpler 1px-border block, not the full R&D Card header/divider pattern; reuse `Card` only if it fits cleanly, otherwise a lighter bordered `<div>` is fine — your call.)

## Context recap
Per `wireframe_solution_pipeline/code.html`, each solution card has: a title (`title-sm` bold), a `StatusChip`, a 2-line clamped description (`body-md`, `--color-on-surface-variant`, CSS `line-clamp: 2`), a provenance line (tiny mono uppercase text, e.g. "Provenance: Matrix Cell (14/36)"), and a hover state that nudges a trailing arrow icon rightward. **Three states** must be supported: `done` (solid border, solid chip), `running` (dashed `--color-primary` border, pulsing "RUNNING" chip, an animated progress bar under the content, italic in-progress description text), and `not-started` (renders as an X-box placeholder — a light-gray box with a diagonal-cross pattern per the design system's placeholder rule — with "Generating Solution N..." text, no title/description/provenance yet). A `SolutionStack` is just a vertical list of these, min 3 per method.

## Task
1. Build `apps/frontend/src/app/features/solution-pipeline/solution-card/` — standalone, `OnPush`, `input()` for `state: 'done'|'running'|'not-started'` plus the solution data (title, description, provenance) which is optional/nullable when `state === 'not-started'`. Implement the diagonal-cross "X-box" placeholder pattern as a reusable CSS class (it's also used decoratively elsewhere, e.g. Screen A) — consider putting it in `styles.scss` as a utility class (`.x-box-placeholder`) rather than duplicating the gradient CSS per component, since it's a shared visual pattern, not solution-card-specific.
2. Build `apps/frontend/src/app/features/solution-pipeline/solution-stack/` — standalone, `OnPush`, `input()` for an array of solution-card view-models, renders one `SolutionCard` per entry.
3. Verify all three states render correctly, including the progress-bar animation for `running` and the placeholder text for `not-started`.

## Files to create/modify
- `apps/frontend/src/app/features/solution-pipeline/solution-card/` (new)
- `apps/frontend/src/app/features/solution-pipeline/solution-stack/` (new)
- `apps/frontend/src/styles.scss` (add `.x-box-placeholder` utility class if you take that approach)

## Out of scope
- Do not fetch data or wire to any service — presentational only, driven entirely by `input()`.
- Do not build the reformulation cards (chunk 12, already done) or the pipeline screen wiring (chunk 14).

## Definition of done
- [ ] Standalone, `OnPush`, `input()`-driven.
- [ ] All three states (`done`/`running`/`not-started`) visually verified against the wireframe, including the pulsing chip and animated progress bar for `running`.
- [ ] No hardcoded hex/px — tokens only.

## Handoff
Chunk 14 renders a `SolutionStack` per method column with real, live-updating data (as solutions transition from `not-started` → `running` → `done`) sourced from `SolveSessionService`.
