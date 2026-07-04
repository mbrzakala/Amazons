---
stage: 3-frontend-arch
step: 3
source: Hackathon Wiki/stages/3-frontend-arch/steps/3-signal-state.md
---

# Validator — 3. Signal-Based State

Checks: `Hackathon Wiki/stages/3-frontend-arch/steps/3-signal-state.md`.

## What this step is proving

All local and shared UI state is managed with Angular signals — no plain mutable
fields the template reads, no manual `.subscribe()` + field-assignment where
`toSignal()`/the `async` pipe would work — and feature-scoped state is actually scoped
per feature, not defaulted to `providedIn: 'root'`.

## Evidence to gather

- Service/component source files, grepped for `signal(`, `computed(`, `.subscribe(`,
  `toSignal(`, and plain field declarations read by templates.
- Service `@Injectable()` decorators — presence/absence of `providedIn: 'root'`.
- Container components' `providers: [...]` arrays.
- A live browser check that the UI updates correctly on state change.

## Gate checklist

1. **No plain mutable fields are used for state that the template reads — everything
   the UI reads is a signal or a `computed()`.**
   Evidence: template bindings vs. the fields they reference.
2. **Feature-scoped state services are `@Injectable()` without `providedIn: 'root'`,
   registered in that feature's container `providers`.**
   Evidence: service decorator + container `providers` array.
3. **Any service marked `providedIn: 'root'` is genuinely cross-cutting (config,
   auth)** — not a default choice.
   Evidence: review each `providedIn: 'root'` service's actual scope/purpose.
4. **No manual `.subscribe()` + field-assignment pattern where `toSignal()` or the
   `async` pipe would work.**
   Evidence: grep for `.subscribe(` paired with a field assignment inside.

Corresponding Result/DoD (once filled): one feature's state lives in a correctly-scoped
signal-holding service; async/HTTP data is bridged to signals, not manually
subscribed-and-assigned; UI updates correctly verified in the browser.

See `agent_doc/README.md` for the verdict scale and reporting format.
