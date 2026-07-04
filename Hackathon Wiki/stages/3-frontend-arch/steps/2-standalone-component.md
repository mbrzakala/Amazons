---
stage: 3-frontend-arch
task: 2
---

# 2. Angular Standalone Component

**What to do:** Scaffold the product's UI as standalone components — no `NgModule`, signal-based inputs/outputs — in the team's real workspace.

**How:**
1. Generate each new component with the Nx generator in the team's actual project (standalone is the default): `nx g @nx/angular:component <name> --project=<your-app-name>`.
2. Declare inputs/outputs with `input()`/`output()` signals, not `@Input()`/`@Output()` decorators.
3. Set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly.
4. If the UI grows past 2-3 screens, split each feature into `pages/` (routed top-level, composes a container) → `containers/` (owns state, calls HTTP, passes data down) → `components/` (pure presentational, inputs/outputs only) — copy this shape from the studied `nan-stack` reference rather than inventing a different split.

**Recommended tool:** `nx g @nx/angular:component` generator. Backup: Claude → Devin IDE to scaffold the component file directly from a prompt describing its inputs/outputs; copying an existing standalone component and stripping its contents if generators misbehave.

## Gate

- [ ] No new `NgModule` was created for this component.
- [ ] Inputs/outputs use `input()`/`output()` signals, not decorators.
- [ ] `OnPush` change detection is set explicitly.
- [ ] If the feature has grown past 2-3 screens, it follows the pages/containers/components split — not one component doing all three jobs.

Next: [[3-signal-state]].

## Result

**Scope:** Scaffold one real product component as a standalone, signal-input/output, `OnPush` Angular component, matching the pattern confirmed in the `nan-stack` reference (`apps/frontend/src/app/components/.../*.ts`).

**DoD:**
- [ ] Component generated via `nx g @nx/angular:component`, no `NgModule` involved.
- [ ] `input()`/`output()` used for all bindings; `OnPush` set explicitly.
- [ ] Component renders correctly standalone (verified in browser, not just compiled).

**Layers:** frontend: components.
