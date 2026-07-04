# Chunk 06 — Form Field Atoms (LabeledTextarea, LabeledInput)

## Depends on
Chunk 01 (tokens).

## Context recap
Screen A's Problem Input Card needs a large textarea and two smaller text inputs, all sharing the same pattern: a `label-caps` label positioned above/outside the box (not floating inside it), a 1px `--color-outline-variant` border that becomes 2px solid `--color-primary` on focus, and placeholder text in `--color-outline-variant`. An error state must be supportable (red border using `--color-error`, plus an associated `aria-live="polite"` message region — the region can live in this component or be left to the parent to render; document whichever you choose).

## Task
1. Generate `apps/frontend/src/app/shared/labeled-textarea/` — standalone, `OnPush`, `input()`s for `label` (string), `placeholder` (string), `rows`/height, `errorMessage` (string | null); two-way value binding via `input()`/`output()` (`value` input + `valueChange` output, or use Angular's `[(ngModel)]`-style pattern with `ControlValueAccessor` if the team prefers reactive forms — pick one and be consistent with chunk-06's sibling `LabeledInput`).
2. Generate `apps/frontend/src/app/shared/labeled-input/` — same pattern, single-line `<input type="text">`.
3. Both must render the focus-border-weight change and, when `errorMessage` is set, both a visible red-border state and an `aria-live="polite"` element containing the message (verify with a screen reader or at minimum confirm the aria-live region exists and updates in the DOM when the error appears/clears).

## Files to create/modify
- `apps/frontend/src/app/shared/labeled-textarea/` (new)
- `apps/frontend/src/app/shared/labeled-input/` (new)

## Out of scope
- Do not build the Problem Input screen itself (chunk 10) or wire any submit logic — these are presentational atoms only, they hold no business logic and don't know about `SolveSessionService`.

## Definition of done
- [ ] Both are standalone, `OnPush`, `input()`/`output()` signals.
- [ ] Focus border weight change (1px → 2px) verified live in browser via Tab/click into the field.
- [ ] Error state (border color + `aria-live` announcement) verified by manually setting `errorMessage` in a throwaway test and observing the DOM update.

## Handoff
Chunk 10 (Screen A) composes the Problem Input Card entirely from these two components plus `Card` (chunk 04) and `Button` (chunk 07) — it should not need to write any new input-styling CSS of its own.
