# Devin Task Board — `apps/frontend` remediation

Source: `frontend-remediation-plan.md`. This is that plan cut into atomic tasks for a free-tier Devin session. Each task is scoped to touch as few files as possible, has a fixed command to verify it, and a clear stop condition. **Give Devin one task at a time, not a whole phase at once** — free-tier models are more reliable on small, unambiguous diffs than on multi-file refactors described in prose.

Every task follows this template:
- **Preconditions** — what must already be true/done.
- **Files** — exact paths, nothing else should be touched.
- **Steps** — literal instructions.
- **Verify** — exact commands to run; all must exit 0 / show no new failures.
- **Done when** — the observable end state.
- **Stop if** — when to halt and report back instead of improvising.

All commands run from the repo root and use `npx nx ...` (npm workspace, per `CLAUDE.md`).

---

## Phase 0 — Baseline (do once, before Phase 1)

### Task 0.1 — Confirm clean baseline
- **Preconditions:** none.
- **Files:** none touched.
- **Steps:**
  1. Run `git status` — working tree must be clean. If not, stop and report.
  2. Create a branch: `git checkout -b chore/frontend-architecture-cleanup`.
- **Verify:** `npx nx build frontend`, `npx nx lint frontend`, `npx nx test frontend` — all must pass. Record the pass/fail state; this is the baseline every later task compares against.
- **Done when:** branch exists, baseline build/lint/test all green (or the pre-existing failure list is recorded so later tasks don't get blamed for it).
- **Stop if:** baseline build/lint/test do not pass — fix or report before proceeding to Phase 1, don't build on a red baseline.

---

## Phase 1 — Delete confirmed dead code

### Task 1.1 — Re-verify the three state services are unreferenced
- **Preconditions:** Task 0.1 done.
- **Files:** none touched (read-only check).
- **Steps:** Run:
  ```
  grep -rn "ProblemInputState" apps/frontend/src
  grep -rn "PipelineState" apps/frontend/src
  grep -rn "EvaluationState" apps/frontend/src
  ```
- **Verify:** each grep must return matches **only** inside the file that declares the class (`problem-input.state.ts`, `pipeline.state.ts`, `evaluation.state.ts` respectively) — no hits in any `*-page.ts`, `*.routes.ts`, or anywhere else.
- **Done when:** all three greps confirm zero external references.
- **Stop if:** any grep shows a reference outside the declaring file — do not delete that file; report which file/line referenced it instead.

### Task 1.2 — Delete the three dead state files
- **Preconditions:** Task 1.1 confirmed all three are safe to delete.
- **Files:**
  - `apps/frontend/src/app/features/problem-input/problem-input.state.ts` (delete)
  - `apps/frontend/src/app/features/pipeline/pipeline.state.ts` (delete)
  - `apps/frontend/src/app/features/evaluation/evaluation.state.ts` (delete)
- **Steps:** `git rm` all three files.
- **Verify:** `npx nx build frontend` — must pass with no "module not found" or missing-provider errors referencing these three classes.
- **Done when:** files removed, build passes.
- **Stop if:** build fails referencing any of the three deleted classes — that means Task 1.1's grep missed a reference; restore the file (`git checkout -- <path>`) and report.

### Task 1.3 — Remove unused `Contradiction`/`Reformulation` interfaces
- **Preconditions:** Task 1.2 done.
- **Files:** `apps/frontend/src/app/models/problem.model.ts`
- **Steps:**
  1. Run `grep -rn "\bReformulation\b" apps/frontend/src` and `grep -rn "\bContradiction\b" apps/frontend/src` — confirm the only hits are inside `problem.model.ts` itself.
  2. If confirmed, remove the `export interface Contradiction { ... }` block and the `export interface Reformulation { ... }` block from `problem.model.ts`.
  3. Keep `ProblemInput` and `HatAnalysis` in the same file untouched — they are used elsewhere.
- **Verify:** `npx nx build frontend`, `npx nx lint frontend` — both pass.
- **Done when:** file contains only `ProblemInput` and `HatAnalysis`.
- **Stop if:** grep shows an external reference — do not remove that interface; report where it's used instead.

### Task 1.4 — Phase 1 full verification + commit
- **Preconditions:** Tasks 1.1-1.3 done.
- **Files:** none (verification only).
- **Steps:** none beyond running the commands below.
- **Verify:** `npx nx build frontend && npx nx lint frontend && npx nx test frontend` — all pass, no new failures vs. the Task 0.1 baseline.
- **Done when:** all green. Commit with message: `chore(frontend): remove unused state services and dead model interfaces`.
- **Stop if:** anything fails — do not proceed to Phase 2 on a red Phase 1.

---

## Phase 2 — Extract duplicated download logic

### Task 2.1 — Create the shared download utility
- **Preconditions:** Phase 1 committed.
- **Files (new):** `apps/frontend/src/app/core/download.util.ts`
- **Steps:** Create the file exporting exactly one function:
  ```ts
  export function downloadJson(filename: string, data: unknown): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  ```
  (This must match, property-for-property, the Blob/anchor/revoke logic currently duplicated in `pipeline-page.ts` and `evaluation-page.ts` — do not add options, error handling, or parameters beyond `filename`/`data`.)
- **Verify:** `npx nx build frontend` passes (new file compiles, nothing imports it yet so no behavior change).
- **Done when:** file exists and builds.
- **Stop if:** the existing duplicated blocks in the two page files differ from each other in any way beyond the filename/variable name (re-check both before writing the shared function) — if they differ, report the difference instead of picking one arbitrarily.

### Task 2.2 — Use it in `pipeline-page.ts`
- **Preconditions:** Task 2.1 done.
- **Files:** `apps/frontend/src/app/features/pipeline/pipeline-page.ts`
- **Steps:**
  1. Add `import { downloadJson } from '../../core/download.util';` at the top.
  2. In `onExportWorkflow()`, keep the `dump` object construction exactly as-is, but replace everything from `const blob = ...` through `URL.revokeObjectURL(url);` with a single call: `downloadJson('workflow-export.json', dump);`.
- **Verify:** `npx nx build frontend`, `npx nx lint frontend` pass.
- **Done when:** `onExportWorkflow()` is 3-4 lines total (build `dump`, call `downloadJson`).
- **Stop if:** the method does anything else besides building `dump` and downloading it (e.g. if it turns out to also update component state) — don't remove that side effect, just replace the download mechanics and report the extra behavior found.

### Task 2.3 — Use it in `evaluation-page.ts`
- **Preconditions:** Task 2.1 done (can run in parallel with 2.2).
- **Files:** `apps/frontend/src/app/features/evaluation/evaluation-page.ts`
- **Steps:**
  1. Add `import { downloadJson } from '../../core/download.util';` at the top.
  2. In `onDownloadReport()`, keep the `report` object construction exactly as-is, replace the Blob/anchor/revoke block with `downloadJson('evaluation-report.json', report);`, and keep the trailing `this.reportDownloaded.set(true);` line after it.
- **Verify:** `npx nx build frontend`, `npx nx lint frontend` pass.
- **Done when:** `onDownloadReport()` builds `report`, calls `downloadJson`, then sets `reportDownloaded`.
- **Stop if:** same caveat as 2.2 — if the method does more than this, don't drop it, report it.

### Task 2.4 — Phase 2 full verification + commit
- **Preconditions:** Tasks 2.1-2.3 done.
- **Steps:** none beyond verification.
- **Verify:** `npx nx build frontend && npx nx lint frontend && npx nx test frontend` pass. Manually run `npx nx serve frontend`, submit a problem, reach `/pipeline`, click "EXPORT WORKFLOW" and confirm a `workflow-export.json` file downloads; reach `/evaluation` and click "DOWNLOAD REPORT" and confirm `evaluation-report.json` downloads.
- **Done when:** both downloads still work. Commit: `refactor(frontend): extract shared downloadJson utility`.
- **Stop if:** either download stops working — revert this phase.

---

## Phase 3 — Consolidate card CSS

### Task 3.1 — Add the shared placeholder to `styles.scss`
- **Preconditions:** Phase 2 committed.
- **Files:** `apps/frontend/src/styles.scss`
- **Steps:** Near the token definitions, add:
  ```scss
  %card-base {
    border: var(--border-1);
    background: var(--color-surface-container-lowest);
  }
  ```
  Do not add `border-radius` or any other property to this placeholder — only add what is verified as common to **all five** target rulesets in Task 3.2-3.6 below (re-check each file's current CSS before assuming `border` + `background` is the correct common set).
- **Verify:** `npx nx build frontend` passes (SCSS compiles; nothing extends it yet, so no visual change).
- **Done when:** placeholder exists in `styles.scss` and compiles.
- **Stop if:** any of the five target files (checked in the next five tasks) turns out not to share both `border: var(--border-1)` and `background: var(--color-surface-container-lowest)` — narrow the placeholder to only the properties truly common to all five, or report the mismatch instead of guessing.

### Task 3.2 — Apply to `shared/ui/rd-card.component.ts`
- **Files:** `apps/frontend/src/app/shared/ui/rd-card.component.ts`
- **Steps:** In the `.card` rule, replace the `border: var(--border-1);` and `background: var(--color-surface-container-lowest);` lines with `@extend %card-base;`. Leave `border-radius`, `.card.active`, `.card.interactive` untouched.
- **Verify:** `npx nx build frontend` passes.
- **Done when:** `.card`'s visual output is unchanged (same computed border/background), just sourced via the placeholder.
- **Stop if:** the rule contains any other property you're unsure whether to keep — leave it exactly where it is and only touch the two lines named above.

### Task 3.3 — Apply to `features/pipeline/method-column.component.ts`
- **Files:** `apps/frontend/src/app/features/pipeline/method-column.component.ts`
- **Steps:** In the `.reform-card` rule, replace the `border: var(--border-1);` and `background: var(--color-surface-container-lowest);` lines with `@extend %card-base;`. Leave `padding`, `display`, `flex-direction`, `gap` untouched.
- **Verify:** `npx nx build frontend` passes.
- **Done when:** same visual output, sourced via placeholder.

### Task 3.4 — Apply to `features/pipeline/six-hats-grid.component.ts`
- **Files:** `apps/frontend/src/app/features/pipeline/six-hats-grid.component.ts`
- **Steps:** This component has two card-like rules — `.hats-grid` (the outer container) and `.hat-card` (each hat). Only `.hat-card`'s `border: var(--border-1);` matches the placeholder's `border` property; `.hat-card` has no `background` declared, so only replace the `border` line with `@extend %card-base;` **only if** you also add a `background: var(--color-surface-container-lowest);` override isn't already implied by inheritance — check the rendered background first. If `.hat-card` currently has no explicit background (relies on parent), do **not** force one via the placeholder; instead skip this file and report it as a mismatch rather than changing its visual appearance.
- **Verify:** `npx nx build frontend` passes; no visual diff.
- **Done when:** either the extend is applied with identical visual output, or the file is explicitly skipped with a one-line note why.

### Task 3.5 — Apply to `features/pipeline/solution-card.component.ts`
- **Files:** `apps/frontend/src/app/features/pipeline/solution-card.component.ts`
- **Steps:** In the `.card` rule, replace the `border: var(--border-1);` line (and `background` only if present and matching) with `@extend %card-base;`. Leave `padding`, `transition`, `.card.running`, `.card:hover` untouched.
- **Verify:** `npx nx build frontend` passes.
- **Done when:** same visual output.

### Task 3.6 — Apply to `features/evaluation/trail-node-template.component.ts`
- **Files:** `apps/frontend/src/app/features/evaluation/trail-node-template.component.ts`
- **Steps:** The `.trail-node` base rule has `background: var(--color-surface-container-lowest)` but no `border` (border is added per-variant via `.trail-node.root`, `.trail-node.reformulation`, etc.). Because `border` is not common here, do **not** force the full `%card-base` placeholder onto `.trail-node` — that would add an unwanted default border. Skip this file; it is structurally different enough (border is state-dependent, not constant) that forcing the shared placeholder would change its appearance. Report this as an intentional exclusion.
- **Verify:** no change made; `npx nx build frontend` still passes (no-op).
- **Done when:** confirmed and documented as excluded.

### Task 3.7 — Phase 3 full verification + commit
- **Preconditions:** Tasks 3.1-3.6 done (3.4 and 3.6 may be documented skips).
- **Verify:** `npx nx build frontend && npx nx lint frontend && npx nx test frontend` pass. Run `npx nx serve frontend` and visually compare `/`, `/pipeline`, `/evaluation` against the screenshots/description in `design-system/rd-card-anatomy.md` and `design-system/ui-frames/` — no visual differences should be present anywhere.
- **Done when:** all green, no visual diff. Commit: `refactor(frontend): consolidate shared card CSS into %card-base placeholder`.
- **Stop if:** any visual difference is spotted — revert the specific file's change, not the whole phase.

---

## Phase 4 — Move pipeline status-simulation into a service

### Task 4.1 — Add `simulateProgress` to `FakeApiService`
- **Preconditions:** Phase 3 committed.
- **Files:** `apps/frontend/src/app/core/fake-api.service.ts`
- **Steps:** Add a new public method (do not touch existing methods):
  ```ts
  simulateProgress(columns: MethodColumn[]): Observable<MethodColumn[]> {
    // emits an updated `columns` snapshot every 3s, flipping the next
    // 'running' solution (in column order) to 'done' with progress: 100,
    // then completes once every solution in every column is 'done'.
  }
  ```
  Implement this using RxJS (`interval(3000)` combined with `scan`/`takeWhile`/`map` over the input `columns`), reproducing **exactly** the update logic currently in `pipeline-page.ts`'s `ngOnInit` timer callback (find the first column with a `running` solution, flip its first running solution to `done`/`progress: 100`, recompute that column's `status`, stop once no column has a running solution left).
- **Verify:** `npx nx build frontend` passes.
- **Done when:** method exists, compiles, is not yet called from the page (still no behavior change at this point).
- **Stop if:** you cannot reproduce the exact update-order logic from `pipeline-page.ts` — copy the existing callback's logic as closely as possible rather than approximating it; if it must diverge, report the divergence.

### Task 4.2 — Refactor `pipeline-page.ts` to consume it
- **Preconditions:** Task 4.1 done.
- **Files:** `apps/frontend/src/app/features/pipeline/pipeline-page.ts`
- **Steps:**
  1. Import `takeUntilDestroyed` from `@angular/core/rxjs-interop`.
  2. In `ngOnInit`, after setting the initial `methodColumns` and session reformulations, subscribe to `this.fakeApi.simulateProgress(columns).pipe(takeUntilDestroyed())`, and on each emission call `this.methodColumns.set(updated)` plus the same `session.setTrizReformulation(updated[0])` / `session.setSecondMethodReformulation(updated[1])` calls the current timer callback makes.
  3. Remove the `transitionTimer` field, the `setInterval` block, and `ngOnDestroy` (remove the `OnDestroy` import/interface implementation too, since `takeUntilDestroyed()` handles cleanup).
- **Verify:** `npx nx build frontend`, `npx nx lint frontend` pass.
- **Done when:** no `setInterval`/`clearInterval`/`ngOnDestroy` remain in `pipeline-page.ts`.
- **Stop if:** `takeUntilDestroyed()` requires an injection context you can't satisfy in this call site (e.g. if called outside a constructor/field initializer) — Angular's `takeUntilDestroyed()` needs to either run in an injection context or be passed a `DestroyRef` explicitly; if the current `ngOnInit` call site errors, inject `DestroyRef` in the constructor and pass it explicitly (`takeUntilDestroyed(this.destroyRef)`) rather than leaving it broken.

### Task 4.3 — Phase 4 full verification + commit
- **Preconditions:** Tasks 4.1-4.2 done.
- **Verify:** `npx nx build frontend && npx nx lint frontend && npx nx test frontend` pass. Run `npx nx serve frontend`, submit a problem, watch `/pipeline`: solutions must still flip from "Running" to "Done" one at a time, roughly every 3 seconds, in the same order as before, and the "SYNTHESIZE RESULTS" button must still enable once all are done.
- **Done when:** behavior matches pre-refactor exactly. Commit: `refactor(frontend): move pipeline progress simulation into FakeApiService`.
- **Stop if:** timing or ordering differs from before — revert and report.

---

## Phase 5 (optional / stretch — only attempt after Phase 4 is green and committed)

### Task 5.1 — Compute numeric coordinates and update the model
- **Files:** `apps/frontend/src/app/models/evaluation.model.ts`
- **Steps:** Change `TrailNode.position` from `{ left: string; top: string }` to `{ x: number; y: number }`.
- **Verify:** `npx nx build frontend` will now fail in `fake-api.service.ts` and `reasoning-trail.component.ts` (expected — those are fixed in the next two tasks). Do not treat this failure as a stop condition for this specific task; proceed directly to 5.2.

### Task 5.2 — Update `FakeApiService` to emit numeric coordinates
- **Files:** `apps/frontend/src/app/core/fake-api.service.ts`
- **Steps:** In `getTrailNodes()`, replace each node's `position: { left: '...', top: '...' }` with `position: { x: <n>, y: <n> }`, using this exact conversion table (already derived from the current `toXY()` logic on an 800px-wide canvas):
  - `'50%'` → `x: 400`
  - `'calc(50% - 300px)'` → `x: 100`
  - `'calc(50% + 300px)'` → `x: 700`
  - `'calc(50% - 200px)'` → `x: 200`
  - `'calc(50% + 200px)'` → `x: 600`
  - `top: '0'` → `y: 0`; `top: '154px'` → `y: 154`; `top: '308px'` → `y: 308`; `top: '462px'` → `y: 462`
- **Verify:** `npx nx build frontend` — this file's errors clear; `reasoning-trail.component.ts` errors remain until Task 5.3.
- **Done when:** all 7 nodes in `getTrailNodes()` use numeric `{x, y}` matching the table above exactly.

### Task 5.3 — Update `ReasoningTrailComponent` to drop the string parser
- **Files:** `apps/frontend/src/app/features/evaluation/reasoning-trail.component.ts`
- **Steps:**
  1. Delete the `toXY()` method entirely.
  2. In `ngOnInit`, change `position: this.toXY(n.position.left, n.position.top)` to `position: n.position` directly (now that `n.position` is already `{x, y}`).
- **Verify:** `npx nx build frontend` passes with no remaining errors anywhere.
- **Done when:** `toXY` no longer exists in the file; build is clean.

### Task 5.4 — Phase 5 full verification + commit
- **Verify:** `npx nx build frontend && npx nx lint frontend && npx nx test frontend` pass. Run `npx nx serve frontend`, navigate to `/evaluation`, and visually confirm the reasoning-trail graph layout is unchanged: root centered at top, three reformulation nodes spread left/center/right below it, two candidate nodes below those, final node centered at the bottom.
- **Done when:** layout matches pre-change screenshots/description in `design-system/ui-frames/wireframe_evaluation_ngd_trail/`. Commit: `refactor(frontend): model TrailNode.position as numeric coordinates`.
- **Stop if:** the graph layout looks different — revert Phase 5 entirely (`git revert` the three commits) and leave a follow-up note; do not attempt to "fix" the coordinates by trial and error.

---

## Final sign-off (after all phases attempted)

- Full `npx nx build frontend`, `npx nx lint frontend`, `npx nx test frontend` green.
- Manual pass through all three routes (`/`, `/pipeline`, `/evaluation`) with no console errors (check via browser devtools or `npx nx serve frontend` output).
- Diff review: confirm no phase touched a file outside the list in that phase's tasks.
- If Phase 5 was skipped or reverted, note that in the PR description as a known follow-up, referencing `frontend-architecture-audit.md` §5.
