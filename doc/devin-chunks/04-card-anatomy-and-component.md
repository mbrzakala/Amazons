# Chunk 04 — R&D Card: Anatomy Doc + Shared Component

## Depends on
Chunk 01 (needs `--color-outline-variant`, `--space-lg`, `--radius-default` tokens).

## Context recap
The "R&D Card" is the most reused container in this app (problem input card, reformulation cards, evaluation table wrapper, reasoning-trail panel all sit inside this shape). Per the design system: 1px border (`--color-outline-variant`), header visually separated by a horizontal rule when a header/title is present, bold title text, `--space-lg` (24px) internal padding, `--radius-default` (4px) corner radius, background `--color-surface-container-lowest` (#ffffff), no shadow ever. A "Level 2 / active" variant swaps the border to 2px solid `--color-primary`.

## Task
1. Write `doc/rd-card-anatomy.md` documenting the component's full anatomy: **parts** (optional header slot with title + optional trailing status-chip slot, a divider rule under the header, a body content-projection slot), **variants** (default / active-focused), **states** (default, hover — only where interactive, e.g. clickable cards on Screen B use a hover border-color shift to `--color-primary`).
2. Generate a standalone `Card` component (`nx g @nx/angular:component` — do not hand-create the folder) under `apps/frontend/src/app/shared/card/`, `ChangeDetectionStrategy.OnPush`, with: an `active` boolean `input()` (switches to the 2px primary border), a `<ng-content select="[card-header]">` and default `<ng-content>` for the body, matching every part/variant/state documented in step 1.
3. Render it once in a throwaway spot (e.g., temporarily in `App`'s template) with both variants visible, screenshot or visually confirm in the browser, then remove the throwaway usage.

## Files to create/modify
- `doc/rd-card-anatomy.md` (new)
- `apps/frontend/src/app/shared/card/card.ts` (+ template/style files, generator-created)

## Out of scope
- Do not build IconButton, StatusChip, or any feature card yet (chunks 05, 12, 13).
- Do not add Tailwind or any CSS framework — plain SCSS referencing chunk 01's tokens only.

## Definition of done
- [ ] `doc/rd-card-anatomy.md` documents all parts, variants, and states (not just the happy path).
- [ ] `Card` is a standalone component, no `NgModule`, `input()` signal (not `@Input()`), `OnPush` set explicitly.
- [ ] Both variants visually verified in a live browser render, not just compiled.
- [ ] No hardcoded hex/px in the component's stylesheet — only `var(--token)`.

## Handoff
Every subsequent card-shaped component (reformulation card, solution card, evaluation table wrapper, reasoning-trail panel) wraps this `Card`, it doesn't reimplement the border/padding/radius itself.
