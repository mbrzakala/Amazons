# Angular Frontend Architecture Audit — `apps/frontend`

Scope: `apps/frontend` (Angular 21, standalone components, Nx workspace). Stack confirmed from `package.json`: `@angular/core ~21.2.0`, signals-based inputs/outputs, `ng-diagram` for the reasoning-trail graph. 21 components total, all reviewed in full.

Severity key: **Critical** (breaks or actively misleads), **High** (real cost to maintainability, should fix soon), **Medium** (worth fixing, not urgent), **Low** (nit/polish).

---

## 1. Design system wiring

**Token layer: solid.** `src/styles.scss:10-105` is a single, well-organized source of truth for color, typography, spacing, radii, and borders as CSS custom properties. A grep for hex literals (`#[0-9a-fA-F]{3,6}`) across `src/` returns matches in exactly three files: `styles.scss` (the token definitions themselves), `core/fake-api.service.ts` (Six Hats swatch colors — legitimate domain data, not styling), and `features/pipeline/pipeline.state.ts` (same domain data, duplicated — see §3). Every component style block consumes tokens via `var(--...)`; there is no hardcoded hex or px value in any `.component.ts` style block. This matches the claim in `design-system/verification-report.md:93-96` and I independently verified it.

**Component primitive layer: fragmented — the main finding here.** The design docs (`design-system/rd-card-anatomy.md`) describe `RdCardComponent` (`shared/ui/rd-card.component.ts`) as "the primary container component in the system, recurring on Screens A and B," with Solution Card, Reformulation Card, and Hat Card documented as "derivative" extensions of it (`rd-card-anatomy.md:134-142`). A grep for `app-rd-card` usage across `src/` shows it is actually consumed in exactly **one place**: `features/problem-input/problem-input-page.html:13`. Every other "card" in the app is an independent implementation that merely happens to reuse the same design tokens, not a composition of `RdCardComponent`:

- `features/pipeline/method-column.component.ts:65-72` (`.reform-card`) — reimplements `border: var(--border-1)`, background, and padding from scratch in a `<div class="reform-card">`.
- `features/pipeline/method-column.component.ts:29-35` (`.hat-card`, inline, used via `six-hats-grid.component.ts:29-35`) — same pattern again.
- `features/pipeline/solution-card.component.ts:35-39` (`.card`) — same border/padding ruleset a third time.
- `features/evaluation/trail-node-template.component.ts:36-41` (`.trail-node`) — a fourth independent card-like container.

Each of these correctly uses tokens (no drift risk on color/spacing), but the actual *component* — the shared primitive meant to encapsulate the border/radius/background ruleset — is bypassed four times over via copy-pasted CSS. This is the opposite of what the design docs describe (composition/extension) and means a future change to the base card treatment (e.g., adding a shadow-free elevation variant) requires editing five files instead of one.

Additionally, `RdCardComponent.interactive` (`shared/ui/rd-card.component.ts:45`) is a dead input — no template anywhere binds `[interactive]`, confirmed by grep. Minor, but it's unused surface area on the one shared primitive that does exist.

One documentation/code mismatch worth flagging: `rd-card-anatomy.md:144-146` lists "Radius not applied" as an open gap on `app-rd-card`, but the actual component (`rd-card.component.ts:17`) already has `border-radius: var(--radius-default);`. The design doc is stale relative to the code — not a code defect, but worth a doc pass so future readers don't chase a already-fixed issue.

**Severity: Medium.** Tokens are exemplary; primitive reuse is not. Recommend either (a) making `RdCardComponent` support the header-padding/no-radius variants needed by the pipeline cards via inputs, and routing all four card-like UIs through it, or (b) if variation is genuinely too different, extracting the shared ruleset into a single SCSS mixin/placeholder so the five implementations can't silently drift.

---

## 2. Smart/dumb component separation

**Overall boundary is clean.** The three route-level pages (`ProblemInputPage`, `PipelinePage`, `EvaluationPage`) are the only components that inject services (`SolveSessionService`, `FakeApiService`, `Router`) or own non-trivial state. Every other component in `shared/ui/` and the feature sub-component trees (`MethodColumnComponent → SixHatsGridComponent`, `SolutionStackComponent → SolutionCardComponent`, `EvaluationTableComponent`, `ReasoningTrailComponent → TrailNodeTemplateComponent`) is a pure `input()`/`output()` presentational component with no injected business services. `ReasoningTrailComponent` injects `NgDiagramModelService` (`evaluation/reasoning-trail.component.ts:117`), but that's binding to the third-party diagram library, not app domain logic — an acceptable exception.

**Two concrete leaks of business/browser logic into container components:**

1. **Duplicated file-download logic.** `features/pipeline/pipeline-page.ts:76-91` (`onExportWorkflow`) and `features/evaluation/evaluation-page.ts:45-65` (`onDownloadReport`) each independently construct a `Blob`, an object URL, a throwaway `<a>` element, trigger `.click()`, and revoke the URL — nearly identical ~15-line blocks, copy-pasted between two page components instead of factored into a shared `core/` utility (e.g., `downloadJson(filename, data)`). This is a DRY violation and it also means a container component is doing raw DOM manipulation that has nothing to do with routing or session orchestration.

2. **Simulation/business logic embedded in a page component's lifecycle.** `features/pipeline/pipeline-page.ts:35-67` runs a `setInterval` inside `ngOnInit` that mutates method/solution statuses from `'running'` to `'done'` every 3 seconds, manually managed with `ngOnDestroy` cleanup (`pipeline-page.ts:69-74`). This is meaningful, non-trivial demo logic (simulating async solution generation) living inside the "smart" page rather than in a service — it would be more consistent with the rest of the architecture (which otherwise puts all data/simulation logic in `FakeApiService` or `SolveSessionService`) to extract this into a dedicated service method, and to use `setInterval`/`clearInterval` less directly (see §4 for the RxJS alternative).

**Severity: Medium.** The container/presentational boundary itself is well-drawn; the issue is that two containers absorbed logic that belongs in the service layer already established elsewhere in the app.

---

## 3. Component granularity & single responsibility

**No god-components.** Decomposition is genuinely granular: `MethodColumnComponent` (97 lines) delegates hats rendering to `SixHatsGridComponent` and solution rendering to `SolutionStackComponent`, which itself delegates to `SolutionCardComponent`. `EvaluationPage`'s template is a thin shell around `EvaluationTableComponent` and `ReasoningTrailComponent`. Every shared UI primitive (`ButtonComponent`, `IconButtonComponent`, `LabeledInputComponent`, `LabeledTextareaComponent`, `PhaseBreadcrumbComponent`, `StageDividerComponent`, `StatusChipComponent`) is single-purpose and under 90 lines.

**High-severity finding: three fully dead "state" services duplicating mock data.** `features/problem-input/problem-input.state.ts`, `features/pipeline/pipeline.state.ts`, and `features/evaluation/evaluation.state.ts` each define an `@Injectable()` class (`ProblemInputState`, `PipelineState`, `EvaluationState`). A workspace-wide grep for each class name shows **zero references anywhere outside the file that declares it** — they are not imported by any page component, not listed in any route's `providers`, not used anywhere. Concretely:

- `problem-input.state.ts` duplicates the exact same `definition`/`systemRequirement`/`physicalLimit`/`isValid` signals that `ProblemInputPage` (`problem-input-page.ts:27-32`) re-implements locally instead of injecting this service.
- `pipeline.state.ts:6-88` hardcodes the identical TRIZ/Six-Hats mock dataset that already lives in `FakeApiService.getReformulations()` (`core/fake-api.service.ts:32-127`) — ~90 lines of duplicated fixture data that is never read.
- `evaluation.state.ts:6-32` hardcodes the identical evaluation rows and trail nodes/edges that already live in `FakeApiService.getEvaluation()`/`getTrailNodes()`/`getTrailEdges()` (`core/fake-api.service.ts:129-161`) — again, never read.

This looks like scaffolding generated per an intended "feature state service" pattern that was later abandoned when the page components ended up owning their state directly (via local signals or `SolveSessionService`), but the abandoned files were never deleted. Beyond the dead-code cost, the duplicated fixture data is a real risk: if `FakeApiService`'s mock data is ever updated, these three files silently go stale and nobody will notice because nothing imports them — but a future engineer skimming the feature folder may reasonably assume `PipelineState` *is* the source of truth for pipeline data, since it sits right next to `pipeline-page.ts`.

**Related dead code:** `models/problem.model.ts:7-18` defines `Contradiction` and `Reformulation` interfaces that are never used anywhere in the codebase (grep confirms the only references are within `problem.model.ts` itself). The actual reformulation shape flowing through the app is the inline `reformulation: {...}` object type on `MethodColumn` in `models/solution.model.ts:18-28`. Two competing, non-overlapping shapes for the same domain concept, one of which is entirely unused.

**Severity: High.** None of this breaks the running app, but three orphaned services plus a dead model duplicate real logic/data three-to-four times over, which is exactly the kind of drift risk that causes bugs when someone edits the "wrong" copy later. Recommend deleting `problem-input.state.ts`, `pipeline.state.ts`, `evaluation.state.ts`, and the unused `Contradiction`/`Reformulation` interfaces, or wiring them in if they were meant to replace the current inline-signal approach in the pages.

---

## 4. Angular conventions

**Strongly idiomatic, consistently applied, for a v21 codebase:**

- **Standalone only.** No `@NgModule` anywhere in `src/`; every component is implicitly standalone (correct — standalone is the v21 default, so omitting the flag is the idiomatic form, not an oversight).
- **Signals-first inputs/outputs.** A grep for `@Input()`/`@Output()`/`@NgModule` across `src/` returns **zero matches**. All 21 components use `input()`/`input.required()`/`output()` consistently, including `booleanAttribute` transforms where appropriate (`shared/ui/button.component.ts:76`).
- **OnPush everywhere.** All 21 components set `changeDetection: ChangeDetectionStrategy.OnPush` — confirmed by grep count (21 matches across 21 files). No component was missed.
- **Modern control flow.** `@if`/`@for` used throughout templates; no legacy `*ngIf`/`*ngFor` found.
- **DI is clean and idiomatic.** The HTTP interceptor (`core/api.interceptor.ts`) is a functional `HttpInterceptorFn` using `inject()`, not a class-based interceptor — correct for v21. `ConfigProvider` (`core/config.provider.ts:23`) uses `inject(API_CONFIG, { optional: true })` with a sane fallback default, which is a clean way to make the injection token optional without breaking tests that don't provide it. `SolveSessionService` is deliberately provided at the route level (`app.routes.ts:7`), not root — correct scoping, since it's session-scoped state for a single "solve" workflow and would otherwise leak across sessions as a stale root singleton.
- **strict TypeScript + strict Angular templates.** `tsconfig.json` has `strict: true`, `strictTemplates: true`, `strictInjectionParameters: true`, `strictInputAccessModifiers: true` — the strictest reasonable configuration, and the codebase has no obvious type-safety escape hatches (no `any` observed in the files reviewed).

**Two minor deviations:**

- `features/pipeline/pipeline-page.ts:33,41-66` manages a `setInterval`/`clearInterval` pair manually across `ngOnInit`/`ngOnDestroy` instead of using an RxJS `interval()`/`timer()` piped through `takeUntilDestroyed()`. Functionally correct (cleanup is handled), but it's the one place in the codebase that reaches for a raw browser timer API instead of the RxJS/signals idioms used everywhere else.
- Inconsistent template/style co-location convention: the three page components use `templateUrl`/`styleUrl` pointing at separate `.html`/`.scss` files, while every other component (all shared UI and feature sub-components) inline `template`/`styles` directly in the `.ts` file. This is a defensible split (pages are bigger, sub-components are small), but it isn't documented as a rule anywhere, so it reads as inconsistent rather than intentional.

**Severity: Low.** Convention adherence here is the strongest of the five audit areas.

---

## 5. Simplicity & correctness

- The three dead state services and dead `Contradiction`/`Reformulation` interfaces from §3 are the clearest anti-pattern in the codebase: unused abstractions that exist without being wired into anything, which cost future readers time trying to figure out if they're load-bearing.
- **Modeling smell in `ReasoningTrailComponent`.** `TrailNode.position` (`models/evaluation.model.ts:18`) is typed as `{ left: string; top: string }` — CSS-string values like `'50%'` or `'calc(50% - 300px)'` — because the original data was meant for absolute-positioned HTML/CSS. But the trail is now rendered via `ng-diagram`, which needs numeric `{x, y}` pixel coordinates. `ReasoningTrailComponent.toXY()` (`evaluation/reasoning-trail.component.ts:173-189`) reverse-engineers those coordinates back out of the CSS strings with a regex (`calc\((\d+)%\s*([+-])\s*(\d+)px\)`). This is a fragile round-trip: domain data is shaped for one rendering technology, then string-parsed back into numbers for another. It works today because the fixture data is hand-written and stable, but it's brittle to any change in position-string formatting and is more complex than modeling `position` as numeric coordinates (or percent + offset fields) from the start.
- **Duplicated download logic** (§2) and **duplicated mock fixture data across four files** (`fake-api.service.ts`, `pipeline.state.ts`, `evaluation.state.ts`, plus the state services already being dead) are both instances of the same underlying issue: no single source of truth being enforced for either behavior or data, even though `FakeApiService` was clearly intended to be that source (per `design-system/frontend-backend-contract.md:34-46`).
- No over-engineering or hallucinated abstractions were found beyond the dead services — there's no premature dependency-injection ceremony, no unnecessary generic/factory layers, no speculative extensibility. The Nx workspace-boundaries doc (`design-system/nx-boundaries-conditional.md`) explicitly and correctly declines to add `tags`/`depConstraints` until a second project type exists, which is the right level of restraint for a one-app workspace.
- No component-level unit tests exist beyond `app.spec.ts` (2 trivial assertions). Not one of the five requested pillars directly, but worth a one-line mention since "correctness" was in scope: nothing currently guards the `computed()` logic (e.g., `allSolutionsReady`, `isRecommended`) or the `toXY()` parsing above from regression.

**Severity: Medium-High**, driven mostly by the dead-code/duplication cluster and the trail position-modeling smell.

---

## Summary table

| # | Area | Verdict | Severity |
|---|---|---|---|
| 1 | Design system wiring | Token layer excellent; component primitive (`RdCardComponent`) documented as shared but used once — four independent card implementations instead | Medium |
| 2 | Smart/dumb separation | Clean boundary overall; download logic and a setInterval simulation leaked into two container components (duplicated) | Medium |
| 3 | Granularity & SRP | Good decomposition; three fully unused "state" services duplicate `FakeApiService` data, plus two dead model interfaces | High |
| 4 | Angular conventions | Signals, OnPush, standalone, functional DI, strict TS all applied consistently across all 21 components | Low |
| 5 | Simplicity & correctness | No over-engineering; the dead-code cluster from #3 and a fragile CSS-string-to-XY parser in the reasoning trail are the main concerns | Medium-High |

## Recommended next actions, in order of impact

1. Delete `problem-input.state.ts`, `pipeline.state.ts`, `evaluation.state.ts`, and the unused `Contradiction`/`Reformulation` interfaces in `problem.model.ts` — or wire them in if they were meant to replace the pages' local signals. This is the single highest-value cleanup and touches zero runtime behavior.
2. Extract the duplicated Blob/anchor download logic (`pipeline-page.ts:76-91`, `evaluation-page.ts:45-65`) into one `core/` utility function.
3. Decide whether the four card-like UIs should compose `RdCardComponent` or whether the shared ruleset should live in a SCSS mixin — either removes the four-way CSS duplication.
4. Re-model `TrailNode.position` as numeric coordinates (or percent + px-offset fields) so `ReasoningTrailComponent.toXY()`'s regex parsing can be deleted.
5. Move the pipeline's simulated status-transition timer into a service method, and consider `interval()` + `takeUntilDestroyed()` over manual `setInterval`/`clearInterval`.
