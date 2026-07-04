# Chunk 18 — Ship Checklist: Nx Boundaries, Accessibility, WCS Baseline, Visual Verification

## Depends on
Chunks 10, 14, 17 (all three screens fully built and wired).

## Context recap
This is the final hardening pass before calling the frontend done — verification and process steps that the hackathon's own `agent_doc` validators explicitly check for, not new feature work.

## Task
1. **Nx boundaries (conditional)**: check whether a second Nx project (e.g. `apps/backend`, or any `lib`) exists yet. If not, this gate is N/A — write a one-line note in `doc/frontend-ui-implementation-plan.md`'s Phase 7 section (or this file) saying so and stop here for this item. If a second project now exists, add real (non-wildcard) `tags` to every `project.json` and a `depConstraints` rule in the root ESLint config before doing anything else in this chunk.
2. **Accessibility pass**: run a Lighthouse (or Chrome DevTools MCP) accessibility audit against all three live screens. Cross-check specifically: contrast (re-verify chunk 01's computed ratios against the actual rendered app, not just the token values in isolation), keyboard reachability (Tab through all three screens end-to-end, confirm every interactive element is reachable and has a visible focus state), icon-button labels (every `IconButton` instance has a real `ariaLabel`), and error-announcement (Screen A's validation error is actually announced, not just visually red). Fix any failing item, or explicitly log it as a known gap in `doc/accessibility-contrast-audit.md` — never silently skip a failure.
3. **WCS baseline**: run the web-codegen-scorer baseline eval (`run-task.sh 0` or the `.ps1` equivalent) against the finished app, open the generated report (don't just generate it and move on), and record the overall numeric score plus per-rating breakdown in a new `doc/wcs-baseline-report.md`. If any rating fails, trace it to the specific rule it violates and note that too.
4. **Visual verification**: for each of the three screens, take a live screenshot and place it side by side (even just descriptively in a markdown note, or literal image files if convenient) with its corresponding `screen.png` wireframe reference, confirming the built screen actually matches — this is a live-render check, not "the code compiles so it must be right."

## Files to create/modify
- `doc/accessibility-contrast-audit.md` (updated with post-build findings)
- `doc/wcs-baseline-report.md` (new)
- Root ESLint config / `project.json` tag fields (only if a second project now exists)

## Out of scope
- Do not add new features or screens here — fixes only, scoped to what the audits actually surface.

## Definition of done
- [ ] Nx-boundaries item is either explicitly marked N/A (single project) or a real `depConstraints` rule now exists (second project case).
- [ ] Accessibility audit run against the live app (not just the design tokens on paper); every failing item fixed or explicitly logged.
- [ ] WCS baseline report exists with a real numeric score, opened and read, not just generated.
- [ ] All three screens screenshotted and visually confirmed against their wireframe references.

## Handoff
This is the last chunk. Once all four items above are checked, the frontend build described in `doc/frontend-ui-implementation-plan.md` is complete and ready for the demo/pitch — anything beyond this point (real NestJS backend, actual TRIZ/second-method reasoning logic, real evaluation scoring) is separately scoped, per that plan's closing note.
