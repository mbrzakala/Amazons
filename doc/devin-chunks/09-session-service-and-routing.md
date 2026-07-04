# Chunk 09 — SolveSessionService Skeleton & Real Routing

## Depends on
Chunk 08 (`TopNav`, `SideNav` components exist).

## Context recap
The three screens (Problem Input → Comparison Pipeline → Evaluation) are sequential steps of one session. State must survive navigation between them but reset when a new session starts — so it's provided on a parent "solve session" route, not `providedIn: 'root'` (root is reserved for genuinely cross-cutting things like config). This chunk builds the *skeleton* only (signal shapes, no real data yet — that starts in chunk 10/11).

## Task
1. Generate `apps/frontend/src/app/core/solve-session.service.ts` — `@Injectable()` **without** `providedIn: 'root'`. Signals: `problem = signal<string | null>(null)`, `problemStatus = signal<'idle'|'submitting'|'error'>('idle')`, plus placeholder signals for later chunks to extend: `trizReformulation`, `secondMethodReformulation`, `trizSolutions`, `secondMethodSolutions`, `evaluation`, `recommendation` (all `signal(null)` or `signal([])` for now — just the shape, real population happens in chunks 10/14/17).
2. Build a root layout component `apps/frontend/src/app/shell/app-shell/` that renders `TopNav` + `SideNav` + `<router-outlet>` in the fixed-64px-top / 260px-left-margin layout described in the wireframes.
3. Rewrite `apps/frontend/src/app/app.routes.ts`: a parent path (e.g. `''` or `/solve`) that renders `AppShell` and provides `SolveSessionService` in its `providers`, with three child routes — `problem`, `pipeline`, `evaluation` — each pointing at a temporary placeholder component for now (real screens land in chunks 10/14/17). Add a default redirect from `''`/empty to `problem`.
4. Remove `NxWelcome` entirely: delete `nx-welcome.ts`, remove its import/usage from `App`'s component and template. `App`'s template becomes just `<router-outlet>` (or delegates directly to the shell via routing — your call, document which).

## Files to create/modify
- `apps/frontend/src/app/core/solve-session.service.ts` (new)
- `apps/frontend/src/app/shell/app-shell/` (new)
- `apps/frontend/src/app/app.routes.ts` (rewritten)
- `apps/frontend/src/app/app.ts`, `app.html` (NxWelcome removed)
- `apps/frontend/src/app/nx-welcome.ts` (deleted)

## Out of scope
- Do not populate any signal with real data yet — no fake API calls in this chunk (chunk 11 builds the fake data layer; chunks 10/14/17 wire it in).
- Do not build the three real screens yet, only routable placeholders.

## Definition of done
- [ ] `nx serve frontend` renders the shell (top nav + side nav + a placeholder body) with no console errors, and no trace of `NxWelcome` remains anywhere in the codebase.
- [ ] `SolveSessionService` is `@Injectable()` without `providedIn: 'root'`, provided in the parent solve-session route's `providers`.
- [ ] Navigating between `/problem`, `/pipeline`, `/evaluation` (however the routes are actually named) works and the sidebar's active state updates correctly per chunk 08's `routerLinkActive` wiring.

## Handoff
From here on, `SolveSessionService` is injected (not `providedIn: 'root'`-style global injection) into the three screen components built in chunks 10, 14, and 17, which extend its signals with real logic.
