# Frontend Remediation Plan — `apps/frontend`

Source: `design-system/frontend-architecture-audit.md`. This plan resolves the 5 findings from that audit, ordered by risk (lowest-risk / zero-behavior-change first, highest-risk last). Each phase is independently buildable and independently revertable — do not start phase N+1 until phase N's verification passes.

Workspace uses **npm** (`package-lock.json` present, no `pnpm-lock.yaml`), so all commands below use `npx nx ...`, per the workspace's own guideline of running everything through Nx rather than the underlying tool.

---

## Guiding rules for whoever executes this (including Devin)

1. One phase = one commit (or one PR). Do not mix phases.
2. Before touching any file, re-grep for the symbol/pattern named in the task — the audit is a point-in-time snapshot and file line numbers may have shifted if anything else changed since.
3. After every phase: `npx nx build frontend`, `npx nx lint frontend`, `npx nx test frontend` must all pass before moving on.
4. Never guess Nx CLI flags — run `npx nx build frontend --help` (or the relevant target) if a flag isn't already used elsewhere in `project.json`.
5. If a task turns out to require touching a file not listed in that task, or the grep in step 2 finds more matches than expected, **stop and flag it** rather than improvising — the point of this breakdown is that surprises mean the plan was wrong, not that the agent should freelance.

---

## Phase 1 — Delete confirmed dead code (zero behavior change)

**Why first:** these files have zero inbound references (verified by grep in the audit). Deleting them cannot change app behavior. This is the safest possible first move and immediately reduces the surface area the rest of the plan has to reason about.

**Targets:**
- `apps/frontend/src/app/features/problem-input/problem-input.state.ts` (class `ProblemInputState`)
- `apps/frontend/src/app/features/pipeline/pipeline.state.ts` (class `PipelineState`)
- `apps/frontend/src/app/features/evaluation/evaluation.state.ts` (class `EvaluationState`)
- `apps/frontend/src/app/models/problem.model.ts` — remove only the unused `Contradiction` (lines 7-11) and `Reformulation` (lines 13-18) interfaces; keep `ProblemInput` and `HatAnalysis`, which are used.

**Verification before deleting:** re-run the grep that found these dead — `grep -rn "ProblemInputState\|PipelineState\|EvaluationState" apps/frontend/src` and `grep -rn "\bReformulation\b\|\bContradiction\b" apps/frontend/src` — confirm each class/interface name still only appears in its own declaration file (for `Reformulation`/`Contradiction`, confirm no other file imports them from `problem.model.ts`).

**Verification after deleting:** `npx nx build frontend`, `npx nx lint frontend`, `npx nx test frontend` all pass with no new errors referencing the deleted symbols.

---

## Phase 2 — Extract duplicated download logic

**Why second:** pure refactor, no visual or data-model change, low risk, immediately removes a DRY violation.

**Target:** `pipeline-page.ts:76-91` (`onExportWorkflow`) and `evaluation-page.ts:45-65` (`onDownloadReport`) both build a `Blob` → object URL → throwaway `<a>` → `.click()` → `revokeObjectURL()`.

**Change:**
1. Create `apps/frontend/src/app/core/download.util.ts` exporting one function: `downloadJson(filename: string, data: unknown): void`, containing the shared Blob/anchor/revoke logic.
2. In `pipeline-page.ts`, replace the body of `onExportWorkflow()` with a call to `downloadJson('workflow-export.json', dump)`, keeping the `dump` object construction as-is.
3. In `evaluation-page.ts`, replace the body of `onDownloadReport()` with a call to `downloadJson('evaluation-report.json', report)` followed by `this.reportDownloaded.set(true)`, keeping the `report` object construction as-is.
4. Do not change the shape of `dump`/`report` — only the download mechanics move.

**Verification:** build/lint/test pass; manually confirm (via `npx nx serve frontend` and clicking both export buttons, or by reading the diff) that both call sites still pass the same object shape they did before.

---

## Phase 3 — Consolidate the four card CSS implementations

**Why third:** touches only styles, not templates or component structure, so it's lower-risk than a structural refactor to compose `RdCardComponent`, while still fixing the duplication.

**Decision made for this plan:** use a **shared SCSS placeholder/mixin**, not component composition. Composition (wrapping `.reform-card`, `.hat-card`, `.solution-card`, `.trail-node` in `<app-rd-card>`) risks visual regressions in padding/border-radius per variant and needs screenshot verification that isn't available in this environment (per `design-system/verification-report.md`, Chrome DevTools MCP was unavailable during the original build too). The mixin approach gets the same "single source of truth" benefit without touching any template.

**Targets and their existing card-shaped rulesets:**
- `shared/ui/rd-card.component.ts:15-19` (`.card`)
- `features/pipeline/method-column.component.ts:65-72` (`.reform-card`)
- `features/pipeline/six-hats-grid.component.ts:29-32` (`.hat-card`)
- `features/pipeline/solution-card.component.ts:35-39` (`.card`)
- `features/evaluation/trail-node-template.component.ts:36-41` (`.trail-node`)

**Change:**
1. Add a `%card-base` SCSS placeholder (or `@mixin card-base`) to `apps/frontend/src/styles.scss`, containing exactly the shared ruleset already common to all five: `border: var(--border-1); background: var(--color-surface-container-lowest);` (add `border-radius: var(--radius-default);` only where a target already has it — do not add radius to targets that didn't have it before, that's a visual change out of scope here).
2. In each of the five files above, replace the duplicated property lines with `@extend %card-base;` (or `@include card-base;`), leaving variant-specific properties (padding, hover, active-state borders, etc.) untouched.
3. Do not change class names, do not change any property not explicitly identified as duplicated in the audit.

**Verification:** build/lint/test pass; diff each of the 5 style blocks and confirm only the shared properties were replaced — every variant-specific rule (padding differences, hover states, dashed borders, etc.) must be byte-identical to before.

---

## Phase 4 — Move pipeline status-simulation off the page component

**Why fourth:** behavior-preserving refactor, but touches lifecycle/timer code, so it carries more risk than phases 1-3 and should only proceed once the codebase is otherwise clean.

**Target:** `features/pipeline/pipeline-page.ts:33` (timer field), `:35-67` (`ngOnInit`, contains the `setInterval` simulation), `:69-74` (`ngOnDestroy`).

**Change:**
1. Add a method to `FakeApiService` (`core/fake-api.service.ts`), e.g. `simulateProgress(columns: MethodColumn[]): Observable<MethodColumn[]>` that emits successive updated states on the same 3-second cadence the component currently implements with `setInterval`, using RxJS (`interval(3000)` + `scan`/`map`, completing once `allDone`), rather than a manually managed `setInterval`/`clearInterval` pair.
2. In `pipeline-page.ts`, replace the `setInterval`/`clearInterval` block with a subscription to this new observable, cleaned up via Angular's `takeUntilDestroyed()` instead of manual `ngOnDestroy` bookkeeping. `ngOnDestroy`/`OnDestroy` can then be removed from the component if nothing else needs it.
3. Preserve the exact existing behavior: one column's next `running` solution flips to `done` (`progress: 100`) every 3 seconds, in the same order, until all solutions are `done`.

**Verification:** build/lint/test pass; manually run `npx nx serve frontend`, navigate to `/pipeline` after submitting a problem, and confirm solutions still transition from running → done every ~3 seconds in the same order as before the change.

---

## Phase 5 (optional / stretch — do only if phases 1-4 are verified green) — Re-model trail node position

**Why last:** this is the highest-risk change — it touches the shared domain model (`TrailNode`), the mock data source, and the diagram-rendering component simultaneously, and a mistake here is the easiest to get visually wrong with no automated visual check available in this environment.

**Target:** `models/evaluation.model.ts:13-21` (`TrailNode.position: { left: string; top: string }`), `core/fake-api.service.ts:140-150` (`getTrailNodes()`, defines positions as CSS strings), `evaluation/reasoning-trail.component.ts:173-189` (`toXY()`, regex-parses those strings back into `{x, y}`).

**Change:**
1. Change `TrailNode.position` to `{ x: number; y: number }` (numeric pixel coordinates), computed by hand once from the current CSS-string values (`'50%'` on an 800px-wide canvas → `x: 400`, `'calc(50% - 300px)'` → `x: 100`, etc. — the existing `toXY()` logic already documents the exact conversion math to use for this one-time translation).
2. Update `fake-api.service.ts:getTrailNodes()` to return the pre-computed numeric coordinates directly.
3. Delete `toXY()` entirely from `reasoning-trail.component.ts` and use `node.position` directly when building `ngNodes` in `ngOnInit`.
4. Do not change `getNodeSize()` or `getNodeLabel()` — only the position plumbing changes.

**Verification:** build/lint/test pass; run `npx nx serve frontend`, navigate to `/evaluation`, and visually confirm the reasoning-trail graph renders with the same relative node layout as before (root centered top, three reformulation nodes spread left/center/right, two candidate nodes below, final node centered at bottom).

**If this phase feels risky to execute confidently: stop after Phase 4 and leave this as a follow-up ticket instead.** Phases 1-4 already resolve the High and Medium findings; this phase is the only one that touches the data model and is explicitly optional.

---

## What this plan intentionally does not do

- It does not touch design tokens (`styles.scss:10-105`) — the audit found no defects there.
- It does not change any Angular convention (signals, `OnPush`, standalone) — the audit found no defects there.
- It does not add new abstractions, libraries, or state-management patterns beyond what's already used in the codebase (signals + RxJS).
