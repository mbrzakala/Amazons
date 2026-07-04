# Chunk 05 — IconButton & StatusChip Components

## Depends on
Chunk 01 (tokens).

## Context recap
Two small, reused atoms:
- **IconButton**: an icon-only button (settings/help in top nav, arrow-forward hints on cards). Must have a required `ariaLabel` input (icon-only buttons with no accessible name are a hard accessibility failure) and a `:focus-visible` state using `--border-width-focus` (2px) and `--color-border-focus`, not `:focus` (so mouse clicks don't show a focus ring, only keyboard nav does).
- **StatusChip**: a small pill (`--radius-full`) with 1px border, two variants — `done` (solid `--color-primary` border) and `running` (dashed border, per design system: "Running status utilizes a dashed border"). Text uses the `label-caps` typography style from chunk 01, uppercase.

## Task
1. Generate `apps/frontend/src/app/shared/icon-button/` — standalone, `OnPush`, `input()`s for `icon` (string, e.g. a Material Symbols ligature name or whatever icon approach the team is using — if no icon library is installed yet, use inline SVG or a simple text/ligature placeholder and note the choice in a code comment) and required `ariaLabel` (string). Emits an `output()` click event.
2. Generate `apps/frontend/src/app/shared/status-chip/` — standalone, `OnPush`, `input()` for `status: 'done' | 'running'` and `label` (string). Renders the pill with the correct border style per status.
3. Verify both render correctly and that `IconButton` is keyboard-focusable with a visible 2px focus ring only on keyboard focus (Tab), not mouse click.

## Files to create/modify
- `apps/frontend/src/app/shared/icon-button/` (new, generator-created)
- `apps/frontend/src/app/shared/status-chip/` (new, generator-created)

## Out of scope
- Do not build the top nav or side nav yet (chunk 08 uses `IconButton`, doesn't build it).
- Do not build solution cards yet (chunk 13 uses `StatusChip`).

## Definition of done
- [ ] Both are standalone, `OnPush`, use `input()`/`output()` signals, no `NgModule`.
- [ ] `IconButton`'s `ariaLabel` input is required (not optional with a default) — a caller cannot render one without an accessible name.
- [ ] Focus ring only appears via `:focus-visible`, verified with actual Tab-key navigation in a browser, not assumed from CSS alone.
- [ ] `StatusChip`'s dashed-vs-solid border difference is visually confirmed for both statuses.

## Handoff
Chunk 07 (Button) may reuse `IconButton`'s icon-rendering approach for buttons with a leading/trailing icon. Chunk 08 (shell nav) uses `IconButton` for settings/help. Chunk 13 (solution cards) uses `StatusChip` for Done/Running/(and a third "not started" state that chunk 13 defines itself, not this one).
