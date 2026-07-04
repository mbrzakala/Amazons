# Frontend UI Implementation Plan — `apps/frontend` (Amazons workspace)

Sources read in full before writing this: `apps/frontend/design-system/Design-system.md`, `.../technical_blueprint/DESIGN.md` (identical content), the three wireframe `code.html` files, `agent_doc/2-design-system/*`, `agent_doc/3-frontend-arch/*`, `agent_doc/4-backend/4-frontend-backend-contract.md` and `5-evaluation-scoreboards.md`, `doc/hackathon_task.md`, `doc/judging_criteria.md`, `doc/deliverables.md`, current `apps/frontend/src/**`, `project.json`, and `package.json`.

---

## 1. Intelligence gathered

### 1.1 Design tokens (verbatim from Design-system.md/DESIGN.md front-matter)

**Color** — grayscale + one accent, used as CSS custom properties, not Tailwind:

| Token | Value | Use |
|---|---|---|
| `--color-surface` | `#f8f9fa` | canvas |
| `--color-surface-container-lowest` | `#ffffff` | cards, table bg |
| `--color-surface-container-low` | `#f3f4f5` | sidebar, panel fill |
| `--color-surface-container` | `#edeeef` | active nav item bg |
| `--color-surface-container-high` / `-highest` | `#e7e8e9` / `#e1e3e4` | hover states |
| `--color-on-background` / `-on-surface` | `#191c1d` | primary text |
| `--color-on-surface-variant` | `#45464c` | secondary text |
| `--color-outline` | `#76777d` | secondary stroke |
| `--color-outline-variant` | `#c6c6cd` | default borders |
| `--color-primary` | `#000000` (brand copy also cites `#111827` — treat `#111827` as the actual "solid black" swatch, `#000000` as the token registry value; **use `#111827` for authored UI, keep `#000000` only where the token table is read programmatically** — flag resolved in §5) | primary actions, focus border, active states |
| `--color-on-primary` | `#ffffff` | text on primary |
| `--color-primary-fixed` | `#dce2f7` | recommended-row tint |
| `--color-error` / `--color-on-error` / `--color-error-container` | `#ba1a1a` / `#ffffff` / `#ffdad6` | validation errors |
| Accent | `#2563EB` (muted blue, brand-copy only, not in the token table) | "Recommended" pathway / "Running" status — reserve exclusively for these two states |

**Typography** (Geist for UI copy, JetBrains Mono for meta/data):

| Token | Family | Size/Line/Weight | Use |
|---|---|---|---|
| `headline-lg` | Geist | 30/36, 600, -0.02em | page H1 |
| `headline-md` | Geist | 24/32, 600 | section H2 / logo |
| `title-sm` | Geist | 18/24, 500 | card titles |
| `body-md` | Geist | 16/24, 400 | body copy, inputs |
| `label-mono` | JetBrains Mono | 13/16, 500, 0.05em | status chips, table cells, IDs |
| `label-caps` | JetBrains Mono | 11/14, 700, 0.1em | field labels, breadcrumbs — always uppercase |

**Spacing** — 4px base unit: `xs 4 / sm 8 / md 16 / lg 24 / xl 48`, gutter 16, page margin 32. Card internal padding is `lg` (24px) per spec.

**Radii**: `sm .125rem`, default `.25rem` (standard inputs/cards), `md .375rem`, `lg .5rem`, `xl .75rem`, `full 9999px` (pills/nodes). Nav items are 0-radius (sharp).

**Elevation**: no shadows anywhere. Level 0 = white canvas. Level 1 = `#F9FAFB`-ish container + 1px `outline-variant` border. Level 2 (focused/active cards) = 2px solid `primary` border. Placeholder/empty media = "skeletal X-box" (two diagonal 1px lines corner to corner). A popover, if ever needed, gets a hard 1px offset instead of a blur shadow.

**Shape**: sharp/squared for containers and inputs (4px), pill or 16px-rounded specifically for "process" elements — reasoning-trail nodes and status chips — to visually separate "container" vs "process" semantics.

**Components called out explicitly**: text inputs (1px border, 2px black on focus, `label-caps` label above, outside the box), R&D cards (1px border, ruled header, bold title), reasoning-trail nodes (rounded-rect, orthogonal 1px elbow connectors, no curves), evaluation table (light-gray row/header fill, 1px cell borders), status chips (pill, dashed border = Running, solid = Done), sidebar nav (text + mono icon, 2px left-accent bar for active), X-box placeholders.

### 1.2 Wireframe screens (from the three `code.html` files — Tailwind CDN markup is the prototype only; it is not to be shipped as-is)

**Shared shell across all three screens**: fixed top nav (64px, `BuildWithAI` wordmark + section tabs + settings/help icon buttons) and a fixed 260px left sidebar (R&D Lab header, nav: New Solve / History / Methods / Lab Tools, footer: Settings / Documentation). The three wireframes disagree slightly on which nav item is "active" per screen (Input → New Solve, Pipeline → New Solve, Evaluation → History) and on the top-nav tab labels (Laboratory/Insights vs Dashboard/Evaluation/Reports) — this is wireframe inconsistency to resolve, not something to encode three different ways (see §5).

**Screen A — `wireframe_problem_input` ("Identify a Contradiction")**: phase breadcrumb (`PHASE 01` boxed + `REASONING` + `EVALUATION` greyed out), H1 + subcopy, one card containing: a labeled textarea (`INPUT_DEFINITION`, skeletal corner decorations, focus → 2px border), a 2-column row of secondary text inputs (`SYSTEM_REQUIREMENT`, `PHYSICAL_LIMIT`), a format hint line, and a primary "SOLVE PROBLEM" button with an arrow icon that nudges right on hover. A decorative 3-box skeletal-X grid below the card is purely atmospheric.

**Screen B — `wireframe_solution_pipeline` ("Comparison Pipeline")**: header with a live "Processing" pill (pulsing dot). A "Stage 01: Problem Reformulation" section divider, then a two-column grid: left = TRIZ (status chip Done/Running), a reformulation card (Improving Parameter / Worsening Parameter / Contradiction Statement, each a labeled sub-block), a dashed "Proposed Solutions (TRIZ)" divider, then a vertical stack of solution cards — each has a title, status chip, 2-line clamped description, provenance line, and a hover arrow; one card is shown mid-generation (dashed primary border, pulsing "RUNNING" chip, animated progress bar, italic in-progress copy). Right column = the second method (wireframe uses Six Thinking Hats): a 2×3 grid of hat mini-cards (colored swatch + hat name + one-line note, with the active/synthesizing hat visually emphasized with a 2px border), same dashed divider + solution stack pattern, with the not-yet-generated slot shown as an X-box placeholder with "Generating Solution 3...". Footer: helper copy ("Evaluation Phase will begin automatically once all generators are 'DONE'") + two buttons (secondary "Export Workflow", primary "Synthesize Results").

**Screen C — `wireframe_evaluation_ngd_trail` ("Evaluation & Reasoning Trail")**: page header with Download Report (secondary) and View Full Trail (primary) actions. Section 1 = **Evaluation Table**: columns Solution Title / Method / Feasibility / Novelty / Impact / Risk / Total Score, mono data cells, light-gray header row, and exactly one row visually pinned as recommended (2px primary border, tinted background, filled star icon, bold, rotated "RECOMMENDED" side tab). Section 2 = **Reasoning Trail ("NGD")**: a directed graph — Problem Root (top) → 3 reformulation nodes (skeleton-loading placeholder content while streaming in) → 2+ candidate/solution nodes (one visually the winning path, filled primary) → 1 terminal "Final Recommendation" node, connected by orthogonal (elbow) 1px lines, a small legend (Node/Step/Connection), and a faint dot-grid background for the "schematic" feel. Bottom actions: secondary "Back to Selection", primary "Initiate Final Validation".

### 1.3 Non-visual constraints (from `agent_doc` validators — these are graded, not optional style preferences)

- Standalone components only, no `NgModule`; `input()`/`output()` signal APIs, not `@Input()`/`@Output()` decorators; `ChangeDetectionStrategy.OnPush` set explicitly on every component.
- All state the template reads is a signal or `computed()` — no plain mutable fields, no manual `.subscribe()` + field assignment where `toSignal()`/`async` pipe would do the job.
- Feature-scoped state services are `@Injectable()` **without** `providedIn: 'root'` and are registered in that feature's own `providers` — `providedIn: 'root'` is reserved for genuinely cross-cutting things (config, auth), not used by default.
- Design tokens live as CSS custom properties in exactly one global stylesheet (`apps/frontend/src/styles.scss`), referenced exactly once from `project.json`'s `styles` array (already true structurally — it's currently empty, that's the gap). No component redeclares token values; no hardcoded hex/px in component styles once tokens exist.
- No Tailwind and no Angular Material are installed in this workspace today. Introducing either would trigger an extra validator gate (both must resolve to the same custom properties, not their own hardcoded values) for zero benefit at this scale — the plan in §3 deliberately keeps plain SCSS + CSS custom properties and does not add either dependency.
- Accessibility (contrast, keyboard reachability, icon-button labelling, error-announcement) must be checked **before** any token is treated as finalized, not retro-fitted after the fact.
- The reasoning-trail diagram must be built with the **`ng-diagram`** library specifically (this is what "NGD" in the wireframe title refers to) if the team judges an interactive node/edge diagram genuinely necessary: global stylesheet import (not component-level), `provideNgDiagram()` on every diagram-hosting component, all node/edge writes through `NgDiagramModelService` (`updateNodes([...])`/`updateEdges([...])` for batch changes — never direct array mutation).
- Frontend↔backend: an interceptor reads the API base URL from a `ConfigProvider` (`fakeApiUrl()` / `apiUrl()`), switchable **per feature**, not one global hardcoded flag — because no backend project exists yet (see gap-scan), the whole app necessarily starts on a fake/mock data layer.
- Nx workspace boundaries (real `tags` + non-wildcard `depConstraints`) are only graded "once a second project exists" — today there is exactly one app (`frontend` + its `frontend-e2e`), so this gate is currently N/A; it becomes real the moment a `backend` app or any shared `lib` is generated.

---

## 2. Gap-scan — current `apps/frontend` vs. the intelligence above

The app is an untouched Nx/Angular 21 scaffold: `App` renders `<app-nx-welcome>` + `<router-outlet>`, `app.routes.ts` is `[]`, `styles.scss` is an empty comment, and there are no feature folders, services, or dependencies beyond bare Angular/Nx. Concretely, against §1:

1. **Tokens**: none exist. `styles.scss` has zero `:root` custom properties. Nothing to violate yet, but nothing to build on either.
2. **Typography**: Geist and JetBrains Mono are not loaded anywhere (no `@font-face`/Google Fonts link, no `index.html` reference).
3. **Shell**: no top nav, no sidebar, no layout component at all.
4. **Routing**: empty `Route[]` — none of the three screens exist as routes.
5. **Components**: zero feature components. Every wireframe card/table/node type in §1.2 needs to be authored from scratch as a standalone, `OnPush`, signal-driven Angular component.
6. **State**: no services exist. The three screens are sequential steps of one session (problem → reformulations → candidates → evaluation → recommendation) and currently have nowhere to live.
7. **`ng-diagram`**: not installed (`node_modules/ng-diagram` absent, no lockfile entry). Needed only for Screen C's reasoning trail.
8. **Data layer / API contract**: no `apps/backend` project exists at all yet, and no `ConfigProvider`/interceptor/fake-API layer exists in the frontend. The frontend currently has nothing to call.
9. **Accessibility**: nothing has been checked yet — no baseline audit exists (there's also no UI to audit).
10. **Nx boundaries**: N/A today (only one app project) — noted so it isn't mistakenly "fixed" prematurely.
11. **Tooling**: no Chrome DevTools MCP verification recorded, no WCS (web-codegen-scorer) baseline run recorded.

Net: this is a from-zero build, not an incremental patch. Every item in §1.2 and most of §1.3 is an open gap.

---

## 3. Architecture decisions (so Devin isn't guessing mid-build)

- **No Tailwind/Material.** Tokens become real CSS custom properties in `styles.scss` under `:root`; components use plain SCSS (`inlineStyleLanguage: scss` is already configured) referencing `var(--token-name)`. This directly satisfies the design-tokens validator's single-stylesheet gate with zero extra dependency risk, and matches the "avoid overcomplication" direction from earlier in this project.
- **Feature folders now, libs later.** Build `apps/frontend/src/app/features/{problem-input,solution-pipeline,evaluation-trail}` plus `app/shell` and `app/core` (services, config) inside the one app project. Do not run `nx g @nx/angular:library` yet — the boundary-rule gate is explicitly N/A until a second project exists, and premature extraction just adds indirection. Revisit the moment `apps/backend` is generated.
- **One session-scoped state service**, not three isolated ones and not `providedIn: 'root'`. A `SolveSessionService` (signals: `problem`, `trizReformulation`, `secondMethodReformulation`, `trizSolutions`, `secondMethodSolutions`, `evaluation`, `recommendation`, plus status signals per stage) is provided on a shell/container route that wraps all three screens, so state survives navigation between them but is destroyed when a new session starts. `computed()` signals derive things like "all six solutions ready" (drives the Screen B → C auto-transition the wireframe implies) and "recommended row id" for Screen C's table highlight.
- **Fake API first, real contract shape from day one.** Since `apps/backend` doesn't exist yet, build a `ConfigProvider` with `fakeApiUrl()`/`apiUrl()` and an HTTP interceptor now, backed initially by an in-memory/fake data service returning realistic payloads shaped like the eventual real contract (problem → reformulations → solutions[] → evaluation{scores, recommendedId, reasoningTrail{nodes,edges}}). This lets Devin ship a fully working demo immediately and swap to the real NestJS API later by flipping config, per-feature, not a rewrite.
- **`ng-diagram` is scoped to exactly one component** (the reasoning-trail host inside `evaluation-trail`). Global stylesheet import goes in `styles.scss`; `provideNgDiagram()` goes only in that host component's `providers`; the initial exact package name/API surface must be confirmed against its real published docs at install time (see §4, verification flagged) rather than assumed from this plan alone.
- **Resolve the wireframe's black-vs-`#111827` and inconsistent nav-active-state discrepancies once**, in the shared shell/tokens work, rather than three times per screen: use `#111827` wherever "solid black" appears in components (matches the written brand copy), keep the token registry's `#000000` only if some automated tool reads the YAML table verbatim; make the sidebar's active item reflect the current route (not a hardcoded per-screen guess), and standardize the top-nav tabs to Laboratory / History / Insights (drop the inconsistent Dashboard/Reports naming from Screen C's markup).

---

## 4. Gap-scan of this plan itself (self-review before handing to Devin)

- **`ng-diagram` package identity is unverified.** I have the *usage pattern* from the validator (`provideNgDiagram()`, `NgDiagramModelService`, `updateNodes`/`updateEdges`, global stylesheet import) but not a confirmed npm package name/version/API signature from primary docs — Devin must resolve this first (Phase 5, task 1) before writing any diagram code, and confirm whether it supports orthogonal/elbow edge routing natively or needs a custom edge renderer to match the "no curved paths" rule.
- **Contrast numbers are asserted, not computed.** I read the palette from the spec but did not run the four grayscale/`on-*` pairs and the `#2563EB` accent through a WCAG contrast calculation. Phase 1 must include actually computing these (e.g., `on-surface-variant` `#45464c` on `surface` `#f8f9fa`) before calling accessibility "checked," not just eyeballing the palette.
- **No backend exists, and the plan doesn't say when it will.** This plan assumes the fake-API layer may need to carry the live demo, not just early development — if `apps/backend` lands before the pitch, the per-feature switch is what makes that safe; if it doesn't, the fake layer *is* the shipped data layer and should be built with that level of care (not throwaway stub data).
- **Wireframe inconsistencies (nav labels/active states, black hex) were resolved unilaterally in §3** — this is a reasonable default, not a verified stakeholder decision; flag it as a one-line note to the team rather than silently diverging from the source HTML.
- **Six Thinking Hats is the wireframe's chosen second method**, but `doc/hackathon_task.md` only requires "a second method of your choosing" and the raw scoring notes mention "5 whys" as an alternative. The UI is being built method-agnostic where possible (reformulation card and solution stack components take a method label/data shape as input, not a hardcoded "Hats" template) so swapping the second method later doesn't require rebuilding Screen B — but the 2×3 hat-grid sub-component is inherently Six-Hats-specific and won't generalize for free if the method changes; that's an accepted, scoped exception, not an oversight.
- **This plan does not cover the NestJS backend, TRIZ/second-method reasoning logic, or evaluation scoring algorithm** — only the Angular frontend, as scoped by the original request. Phase 7 below only wires the *contract*, not the server-side implementation.

---

## 5. Phased task breakdown for the Devin IDE agent

Each task lists what "done" means in terms the corresponding `agent_doc` validator will check, so completion is self-auditable, not just "looks right."

### Phase 0 — Environment & verification prerequisites
1. Resolve and install the real `ng-diagram` package; record its actual API against the assumptions in §3/§4 (update this doc if the real API differs).
2. Load Geist + JetBrains Mono (self-hosted or Google Fonts link in `index.html`) — no CDN Tailwind font bundle.
3. Connect Chrome DevTools MCP and Modern Web Guidance now; run the one deliberate-bug verification (remove a template binding, confirm the agent reports the real console error unaided) and log it — do this before, not during, a real debugging crisis (validator step 3-frontend-arch/5).

### Phase 1 — Design tokens & global shell styles
1. Write all tokens from §1.1 into `apps/frontend/src/styles.scss` as `:root` CSS custom properties; confirm `project.json`'s `styles` array still references this one file only.
2. Compute and record actual contrast ratios for every text/background pairing in use (`on-surface`/`surface`, `on-surface-variant`/`surface`, `on-primary`/`primary`, the `#2563EB` accent on white) — fix or log any AA failure before moving on.
3. Document one component's full anatomy (recommend the R&D Card, since it recurs on Screens A/B) — variants, states, parts — in this doc or a sibling file, satisfying the design-tokens-anatomy validator.

### Phase 2 — App shell (shared across all three screens)
1. Build `app/shell/top-nav` and `app/shell/side-nav` standalone `OnPush` components matching §1.2's shared-shell description, with the nav-label/active-state inconsistencies resolved per §3.
2. Wire `app.routes.ts` with a parent "solve session" route providing `SolveSessionService`, and three child routes for the screens (e.g. `problem`, `pipeline`, `evaluation`), replacing the `NxWelcome` placeholder entirely.
3. Keyboard-check the shell now: every sidebar link and icon-only top-nav button (settings/help) is reachable by Tab and has an `aria-label`; the 2px focus-border spec is implemented via `:focus-visible`, not `:focus`, so mouse users don't see a border storm.

### Phase 3 — Screen A: Problem Input
1. Build the phase-breadcrumb, heading, and Problem Input Card (labeled textarea + two secondary inputs + format hint + submit button) exactly per §1.2 Screen A, using tokens only.
2. `SolveSessionService.submitProblem(...)` signal-based method; submit button disabled until non-trivial input (mirrors the earlier UI-spec conversation's guidance); on submit, navigate to the pipeline route.
3. Error-announcement: an empty/invalid submit attempt announces via an `aria-live="polite"` region, not just a visual red border.
4. Drop the decorative skeletal-X 3-box grid as a non-interactive presentational component (or omit — it's explicitly decorative per the wireframe comment) rather than wiring it to fake data.

### Phase 4 — Screen B: Comparison Pipeline
1. Build the two-column layout: reformulation card (TRIZ: improving/worsening parameter + contradiction statement) and the second-method reformulation card, each independently async and independently showing a Done/Running status chip (dashed border = running, solid = done, per §1.1).
2. Build the reusable solution-card component (title, status chip, clamped description, provenance line) with three states — done, running (dashed border, pulsing chip, progress bar), and not-yet-started (X-box placeholder) — driven by data, not three hand-copied templates.
3. `SolveSessionService` methods to fetch/stream reformulations and solutions from the fake API layer (§3); a `computed()` signal exposes "all ≥3-per-method solutions done," which triggers the auto-transition/enable of "Synthesize Results" described in the wireframe footer.
4. Six-Hats-specific sub-grid: build it as its own small component consuming hat data, kept separate from the generic solution-card/reformulation-card so a future method swap only replaces this one piece (§4 accepted scope).

### Phase 5 — Screen C: Evaluation & Reasoning Trail
1. Build the Evaluation Table as a real data-bound table (not hardcoded rows): columns per §1.2, one row visually pinned as recommended via a `computed()` "is this the recommended id" check, not a hardcoded row index.
2. Stand up the reasoning-trail diagram with the resolved `ng-diagram` API (Phase 0.1): `provideNgDiagram()` on this component only, nodes/edges built via `NgDiagramModelService.updateNodes([...])`/`updateEdges([...])` from the session's data (problem → reformulations → candidates → recommendation), orthogonal edge routing, custom node templates styled to the token set (rounded-rect, no shadows).
3. Download Report / View Full Trail / Back to Selection / Initiate Final Validation buttons wired to real (even if stubbed) actions — not dead links.

### Phase 6 — Frontend↔backend contract scaffolding
1. Build `ConfigProvider` with `fakeApiUrl()`/`apiUrl()` and an HTTP interceptor that reads the base URL from it, per feature — even though `apps/backend` doesn't exist yet, this makes the later swap config-only.
2. Build the fake data layer with realistic, contract-shaped payloads (see §3) good enough to be the actual demo data source if the real backend isn't ready in time — log this decision explicitly rather than leaving it an implicit stopgap.

### Phase 7 — Nx boundaries (conditional)
1. Skip while `frontend`/`frontend-e2e` remain the only projects (validator gate is N/A) — but the moment `apps/backend` or any `lib` is generated, add real `tags` to every `project.json` and a non-wildcard `depConstraints` rule immediately, not retroactively.

### Phase 8 — Verification & scoring
1. Run a Lighthouse/DevTools accessibility audit against the built app; fix or explicitly log any failing item (contrast, keyboard, labels, error-announcement all covered).
2. Run the web-codegen-scorer baseline (`run-task.sh 0`), open the report, record the numeric score and per-rating breakdown, and trace any failing rating to its specific rule.
3. Live-render check in an actual browser for all three screens (not just a successful `nx build`) — screenshot each against its wireframe for the visual-verification requirement in the component-generation validator.

---

**Not covered by this plan** (explicitly out of scope, per §4): the NestJS backend implementation, the actual TRIZ contradiction-matrix and second-method reasoning logic, and the evaluation/scoring algorithm. Those need their own `agent_doc/4-backend/*`-driven plan before Phase 6/7 above can point at a real API instead of the fake one.
