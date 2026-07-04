---
stage: 3-frontend-arch
task: 3
---

# 3. Signal-Based State

**What to do:** Manage all local and shared UI state with Angular signals — no manual `.subscribe()` bookkeeping.

**How:**
1. Hold state in `signal()`, derive values with `computed()`. Never assign to a plain field and expect the UI to update.
2. For state scoped to one feature/screen, put it in an `@Injectable()` service **without** `providedIn: 'root'`, and list it in that feature's container component `providers: [...]` array — this scopes a fresh instance per container instead of one app-wide singleton.
3. Only use `@Injectable({ providedIn: 'root' })` when the state is genuinely cross-cutting (app config, auth state) — not by default.
4. Bridge any Observable-based data into a signal with `toSignal()` (or the `async` pipe); avoid hand-rolled `.subscribe()` plus manual field assignment.

**Recommended tool:** Angular's built-in `signal()` / `computed()` — no library install needed. Backup: NgRx SignalStore, only once 2+ unrelated features genuinely need to share complex async state; a plain injectable service holding signals (the default approach, sufficient for nearly all hackathon-scale state).

## Gate

- [ ] No plain mutable fields are used for state that the template reads — everything the UI reads is a signal or a `computed()`.
- [ ] Feature-scoped state services are `@Injectable()` without `providedIn: 'root'`, registered in that feature's container `providers`.
- [ ] Any service marked `providedIn: 'root'` is genuinely cross-cutting (config, auth) — not a default choice.
- [ ] No manual `.subscribe()` + field-assignment pattern where `toSignal()` or the `async` pipe would work.

Next: [[4-ng-diagram-interactive-diagram]].

## Result

**Scope:** Implement one feature's state as a signal-based, correctly-scoped service, matching the two confirmed patterns from `nan-stack` (feature-scoped service via container `providers`, vs. app-wide `providedIn: 'root'` only for genuinely global state like config).

**DoD:**
- [ ] One feature has its state in a signal-holding service, scoped correctly (container-provided unless genuinely global).
- [ ] Async data (HTTP) is bridged to signals, not manually subscribed-and-assigned.
- [ ] UI updates correctly on state change, verified in the browser.

**Layers:** frontend: state management, services.
