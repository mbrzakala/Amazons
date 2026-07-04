# Chunk 17 — Screen C: Evaluation & Reasoning Trail (Full Screen Wiring)

## Depends on
Chunk 15 (evaluation table), chunk 16 (reasoning trail diagram), chunk 09 (`SolveSessionService`, `evaluation` route placeholder).

## Context recap
Per `wireframe_evaluation_ngd_trail/code.html`: a page header ("Evaluation & Reasoning Trail") with two actions — secondary "DOWNLOAD REPORT", primary "VIEW FULL TRAIL" — then Section 1 (the Evaluation Table from chunk 15) and Section 2 (the Reasoning Trail from chunk 16), each wrapped in a bordered white panel per the R&D Card pattern (reuse `Card` from chunk 04 if it fits the section-header + divider pattern cleanly). A bottom action row holds secondary "Back to Selection" and primary "Initiate Final Validation".

## Task
1. Replace the `evaluation` route's placeholder with the real screen. On entering this screen, trigger `SolveSessionService`'s call to the fake data layer's evaluation endpoint (using the now-complete `trizSolutions`/`secondMethodSolutions` from Screen B) to populate the `evaluation` signal.
2. Compose the page header, `EvaluationTable` (chunk 15), `ReasoningTrail` (chunk 16), and bottom actions.
3. Wire "Back to Selection" to navigate back to the `pipeline` route (session state should still be intact, since it's provided on the parent solve-session route, not this leaf route). "Initiate Final Validation" and "Download Report"/"View Full Trail" can be stub actions for now (document exactly what each does — e.g., "Download Report" could serialize the session to JSON and trigger a browser download, which is a reasonable real implementation, not just a stub).

## Files to create/modify
- `apps/frontend/src/app/features/evaluation-trail/` (screen component, replaces chunk-09 placeholder)
- `apps/frontend/src/app/core/solve-session.service.ts` (extended with evaluation fetch)
- `apps/frontend/src/app/app.routes.ts` (point `evaluation` route at the real component)

## Out of scope
- Do not modify `EvaluationTable` or `ReasoningTrail` internals here beyond passing them the right inputs — implementation changes belong in chunks 15/16.

## Definition of done
- [ ] Full screen renders live with real evaluation data from the fake API layer.
- [ ] "Back to Selection" preserves session state (verified by navigating back and confirming Screen B still shows its solutions, not a blank/reset state).
- [ ] Screenshot compared against `wireframe_evaluation_ngd_trail/screen.png`.

## Handoff
All three screens are now fully built and connected end to end (Problem Input → Comparison Pipeline → Evaluation). Chunk 18 verifies the whole thing.
