# Chunk 10 — Screen A: Problem Input (Full Screen)

## Depends on
Chunk 04 (`Card`), 06 (`LabeledTextarea`, `LabeledInput`), 07 (`Button`), 09 (`SolveSessionService` skeleton + `problem` route placeholder).

## Context recap
Wireframe (`wireframe_problem_input/code.html`): a phase breadcrumb (`PHASE 01` boxed in `label-caps` + `--color-primary` border, then `REASONING`, then greyed-out `EVALUATION`, separated by short horizontal rules), an `headline-lg` H1 "Identify a Contradiction" + `body-md` subcopy, then one `Card` containing: a `LabeledTextarea` labeled `INPUT_DEFINITION` with placeholder "I need X to improve, but Y degrades when I push it...", a 2-column row of `LabeledInput`s (`SYSTEM_REQUIREMENT` / `PHYSICAL_LIMIT`), a format-hint line in small italic mono text, and a primary `Button` "SOLVE PROBLEM" with a trailing arrow that nudges right on hover (a simple CSS `transform: translateX()` on hover is enough, no JS needed). The decorative 3-box skeletal-X grid below the card is purely atmospheric — implement it as static presentational markup with no data binding, or omit it entirely; either is acceptable.

## Task
1. Replace the `problem` route's placeholder component with the real screen, built entirely from `Card`/`LabeledTextarea`/`LabeledInput`/`Button` — no new bespoke input styling.
2. Extend `SolveSessionService` with a `submitProblem(problem: string, systemRequirement?: string, physicalLimit?: string)` method: validates non-trivial input length, sets `problemStatus` to `'error'` with a message if invalid (surfaced via the textarea's `errorMessage` input + its `aria-live` region from chunk 06), otherwise sets `problem` signal, `problemStatus` to a success state, and navigates to the `pipeline` route.
3. The "SOLVE PROBLEM" button is disabled while `problemStatus() === 'submitting'` and re-enabled on error so the user can retry.

## Files to create/modify
- `apps/frontend/src/app/features/problem-input/` (new — replaces the chunk-09 placeholder for this route)
- `apps/frontend/src/app/core/solve-session.service.ts` (extended)
- `apps/frontend/src/app/app.routes.ts` (point `problem` route at the real component)

## Out of scope
- Do not call any real or fake HTTP API here — `submitProblem` just validates and stores locally on the session service; the fake API layer (chunk 11) is consumed starting in chunk 14, not here.
- Do not build the phase-breadcrumb as a reusable component unless you want to (optional) — do not over-engineer it, a simple inline template is fine since it currently only appears once.

## Definition of done
- [ ] Screen renders per the wireframe description above, live-verified in browser, tokens only (no hardcoded hex/px).
- [ ] Submitting an empty/too-short problem shows a visible error AND announces via the `aria-live` region (verify in DOM, not just visually).
- [ ] Submitting a valid problem navigates to the pipeline route and `SolveSessionService.problem()` holds the submitted text.
- [ ] Screenshot taken and visually compared against `apps/frontend/design-system/ui-frames/wireframe_problem_input/screen.png`.

## Handoff
Chunk 14 (Screen B) reads `SolveSessionService.problem()` as the input to the reformulation/solution-generation flow.
