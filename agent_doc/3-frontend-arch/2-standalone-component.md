---
stage: 3-frontend-arch
step: 2
source: Hackathon Wiki/stages/3-frontend-arch/steps/2-standalone-component.md
---

# Validator — 2. Angular Standalone Component

Checks: `Hackathon Wiki/stages/3-frontend-arch/steps/2-standalone-component.md`.

## What this step is proving

The product's UI is scaffolded as standalone components (no `NgModule`), using
signal-based `input()`/`output()` instead of decorators, with `OnPush` set explicitly,
splitting into pages/containers/components once a feature grows past 2-3 screens.

## Evidence to gather

- Component source files (`.ts`), grepped for `NgModule`, `@Input()`/`@Output()`
  decorators, `input()`/`output()` signal calls, and
  `ChangeDetectionStrategy.OnPush`.
- Folder structure for any feature with more than 2-3 screens (`pages/`, `containers/`,
  `components/`).
- A live render check in the browser.

## Gate checklist

1. **No new `NgModule` was created for this component.**
   Evidence: grep for `@NgModule` near the component. Fail if one was added.
2. **Inputs/outputs use `input()`/`output()` signals, not decorators.**
   Evidence: component source. Fail on any `@Input()`/`@Output()` decorator usage.
3. **`OnPush` change detection is set explicitly.**
   Evidence: component decorator's `changeDetection` field.
4. **If the feature has grown past 2-3 screens, it follows the
   pages/containers/components split — not one component doing all three jobs.**
   Evidence: folder structure. N/A if the feature is still ≤2-3 screens.

Corresponding Result/DoD (once filled): component generated via
`nx g @nx/angular:component`, renders correctly standalone verified in browser (not
just compiled).

See `agent_doc/README.md` for the verdict scale and reporting format.
