# Chunk 08 — TopNav & SideNav Shell Components

## Depends on
Chunk 01 (tokens), chunk 05 (`IconButton` for settings/help icons).

## Context recap
All three wireframes share the same shell: a fixed 64px top nav (`BuildWithAI` wordmark in `headline-md` bold, section tabs, settings/help icon buttons using `IconButton`) and a fixed 260px left sidebar (`R&D Lab` header + `label-mono` subcopy, nav items: New Solve / History / Methods / Lab Tools, footer: Settings / Documentation). The wireframes disagree with each other on which nav item is "active" and on the top-nav tab labels — resolve this here, once: sidebar's active item must reflect the **actual current route** (via Angular Router, e.g. `routerLinkActive`), not a hardcoded per-screen guess; standardize top-nav tabs to **Laboratory / History / Insights**. Active nav item gets a 2px left-accent bar in `--color-primary` and background `--color-surface-container`; inactive items are `--color-on-surface-variant` with a hover background of `--color-surface-container-highest`. Sidebar nav items are 0-radius (sharp corners) per the design system.

## Task
1. Generate `apps/frontend/src/app/shell/top-nav/` — standalone, `OnPush`. Wordmark + three route-linked tabs (Laboratory/History/Insights — link them to real routes if they exist yet, or `#`/a route placeholder if the target routes aren't built until later chunks; note which) + two `IconButton`s (settings, help) with real `ariaLabel`s.
2. Generate `apps/frontend/src/app/shell/side-nav/` — standalone, `OnPush`. Header block + 4 nav items (New Solve, History, Methods, Lab Tools) using `routerLink`/`routerLinkActive` so the active state is route-driven, not hardcoded — footer block (Settings, Documentation).
3. Do not wire these into `app.routes.ts` or a root layout yet — that's chunk 09. Just build and visually verify the two components in isolation (e.g., temporarily rendered together in `App`'s template, then left in place since chunk 09 will properly place them in the real layout).

## Files to create/modify
- `apps/frontend/src/app/shell/top-nav/` (new)
- `apps/frontend/src/app/shell/side-nav/` (new)

## Out of scope
- Do not touch `app.routes.ts` or remove `NxWelcome` yet (chunk 09).
- Do not build `SolveSessionService` here.

## Definition of done
- [ ] Both standalone, `OnPush`.
- [ ] Sidebar active state is driven by `routerLinkActive`, not a hardcoded per-instance input.
- [ ] Both icon buttons have real `ariaLabel`s and are keyboard-reachable (Tab order verified).
- [ ] Visually verified against the shared-shell description in `doc/frontend-ui-implementation-plan.md` §1.2.

## Handoff
Chunk 09 builds the actual root layout component that renders `TopNav` + `SideNav` + `<router-outlet>` together and wires real routes for them to link to.
