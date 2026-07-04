# Chunk 14 — Screen B: Comparison Pipeline (Full Screen Wiring)

## Depends on
Chunk 12 (reformulation cards), 13 (solution card/stack), 11 (fake data layer), 09 (`SolveSessionService`, `pipeline` route placeholder).

## Context recap
Per `wireframe_solution_pipeline/code.html`: a header with the screen title and a live "Processing" pill (pulsing dot, visible while anything is still `running`), a "Stage 01: Problem Reformulation" section divider (plain horizontal rule with a `label-caps` label), then a two-column grid — left = TRIZ (`triz-reformulation-card` + a dashed "Proposed Solutions (TRIZ)" divider + `solution-stack`), right = the second method (`six-hats-grid` + dashed divider + `solution-stack`). A footer holds helper copy ("Evaluation Phase will begin automatically once all generators are 'DONE'") and two buttons: secondary "EXPORT WORKFLOW", primary "SYNTHESIZE RESULTS" — the primary button should be disabled until all ≥6 solutions (≥3 per method) are `done`.

## Task
1. Replace the `pipeline` route's placeholder with the real screen, composed from chunks 12/13's components plus `Card` (chunk 04) for the divider/section wrapping as needed.
2. Extend `SolveSessionService` with methods that, on entering this screen (or on constructor init), call the fake data service (chunk 11) to fetch both reformulations, then fetch/stream both methods' solutions with the staggered timing chunk 11 built — exposing signals the template binds to directly (no manual `.subscribe()` + field assignment; use `toSignal()` or update a `signal()` from within the async flow).
3. Add a `computed()` signal `allSolutionsReady` (true once both methods have ≥3 `done` solutions) that: (a) drives the header's "Processing" pill visibility, and (b) enables the "SYNTHESIZE RESULTS" button.
4. Wire "SYNTHESIZE RESULTS" to navigate to the `evaluation` route (triggering chunk 17's screen, which will itself kick off the evaluation fetch). "EXPORT WORKFLOW" can be a stub action (e.g., logs or downloads a JSON dump of current session state) — note which you picked.

## Files to create/modify
- `apps/frontend/src/app/features/solution-pipeline/` (screen component, replaces chunk-09 placeholder)
- `apps/frontend/src/app/core/solve-session.service.ts` (extended)
- `apps/frontend/src/app/app.routes.ts` (point `pipeline` route at the real component)

## Out of scope
- Do not build the evaluation screen (chunk 17) — only navigate to its route.
- Do not hardcode the six-hats data as a static template; it must come from the fake data service so it's genuinely "generated," matching the hackathon requirement that every step be a real inspectable piece of logic, not a dressed-up static prompt.

## Definition of done
- [ ] Screen renders per the wireframe, live-verified, both columns populate from the fake data layer with visible running→done transitions (not instantaneous).
- [ ] "SYNTHESIZE RESULTS" is disabled until `allSolutionsReady()` is true, then navigates to the evaluation route.
- [ ] No `.subscribe()` + manual field assignment anywhere in this screen's code — signals/`toSignal()` only.
- [ ] Screenshot compared against `wireframe_solution_pipeline/screen.png`.

## Handoff
Chunk 17 (Screen C) reads the now-populated `trizSolutions`/`secondMethodSolutions` signals (or triggers the evaluation fetch itself) from `SolveSessionService`.
