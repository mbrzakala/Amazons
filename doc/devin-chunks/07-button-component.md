# Chunk 07 — Button Component

## Depends on
Chunk 01 (tokens), chunk 05 (optional icon-rendering approach reuse from `IconButton` if you want a shared icon-render helper — not required, a duplicate small icon slot is acceptable too).

## Context recap
Two visual variants appear across every screen: **primary** (solid `--color-primary` background, `--color-on-primary` text, e.g. "SOLVE PROBLEM", "SYNTHESIZE RESULTS", "Initiate Final Validation") and **secondary** (white background, border, e.g. "EXPORT WORKFLOW", "Back to Selection", "DOWNLOAD REPORT"). Text uses the `label-caps` or `label-mono` style depending on where it's used in the wireframes — check the specific screen's markup when composing (chunk 10/14/17 decide per-instance, this component just needs to support both text sizes via a projected content slot, not a hardcoded string).

## Task
1. Generate `apps/frontend/src/app/shared/button/` — standalone, `OnPush`, `input()` for `variant: 'primary' | 'secondary'` and `disabled` (boolean), `output()` for click, `<ng-content>` for the label (and optionally a named slot for a leading/trailing icon).
2. Implement hover/active states per the wireframes (opacity shift on hover for primary, background tint for secondary) using tokens only, and disabled state (visually distinct, `disabled` attribute set on the underlying `<button>`, not just a CSS class — a disabled button must not be keyboard-activatable).
3. Verify both variants render and that `disabled` actually blocks both mouse and keyboard activation.

## Files to create/modify
- `apps/frontend/src/app/shared/button/` (new)

## Out of scope
- Do not build any specific button instance/screen wiring — that happens in chunks 10, 14, 17.

## Definition of done
- [ ] Standalone, `OnPush`, `input()`/`output()` signals.
- [ ] Both variants visually verified.
- [ ] `disabled` state verified to actually block activation (not just look greyed out).

## Handoff
Every "SOLVE PROBLEM" / "SYNTHESIZE RESULTS" / "EXPORT WORKFLOW" / "DOWNLOAD REPORT" / "VIEW FULL TRAIL" / "Back to Selection" / "Initiate Final Validation" button in later chunks is an instance of this component, not a hand-rolled `<button>`.
