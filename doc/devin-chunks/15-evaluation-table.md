# Chunk 15 — Evaluation Table Component

## Depends on
Chunk 01 (tokens), chunk 11 (fake data layer — for the evaluation payload shape).

## Context recap
Per `wireframe_evaluation_ngd_trail/code.html`: columns `Solution Title / Method / Feasibility / Novelty / Impact / Risk / Total Score`, `label-caps` header row on `--color-surface-container-low` background, `label-mono` data cells, 1px `--color-outline-variant` cell borders. Exactly one row is visually pinned as "recommended": 2px `--color-primary` border, `--color-primary-fixed` background tint, a filled star icon, bold text, and a small rotated "RECOMMENDED" side tab. This must be **data-driven** — the recommended row is whichever row matches `evaluation.recommendedSolutionId`, not a hardcoded row index or CSS `:first-child`/`:nth-child` hack.

## Task
1. Build `apps/frontend/src/app/features/evaluation-trail/evaluation-table/` — standalone, `OnPush`, `input()` for the evaluation payload (`scores` array + `recommendedSolutionId`) matching chunk 11's contract shape.
2. Render one row per solution; use a `computed()` (or an inline check per row against the `recommendedSolutionId` input) to apply the recommended-row styling — do not hardcode which row it is.
3. Verify with the fake data layer's evaluation payload that the correct row highlights.

## Files to create/modify
- `apps/frontend/src/app/features/evaluation-trail/evaluation-table/` (new)

## Out of scope
- Do not build the reasoning-trail diagram here (chunk 16).
- Do not build the full Screen C layout/header/actions (chunk 17).

## Definition of done
- [ ] Standalone, `OnPush`, fully data-driven — swapping which `recommendedSolutionId` is passed in changes which row highlights, verified by testing with two different fake payloads.
- [ ] Visually matches the wireframe's table styling (header fill, cell borders, recommended-row treatment) using tokens only.

## Handoff
Chunk 17 places this component in Screen C, fed by `SolveSessionService`'s evaluation data (populated via the fake API in chunk 11).
