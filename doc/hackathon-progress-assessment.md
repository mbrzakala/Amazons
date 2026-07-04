# Amazons — Hackathon Progress Assessment

As of 11:15, ~2h45m into the single 9.5h coding window (08:30–18:00; pitch 18:05–19:30; results 20:35). Repo: `mbrzakala/Amazons`. Evidence is cited inline; a compact source list closes the doc.

## Progress Snapshot
16 commits, all today, 09:00–10:55. **Zero backend code exists** — `apps/` contains only `frontend` and `frontend-e2e`; no `apps/backend`, no NestJS/Sequelize/Docker/Postgres/pytriz MCP server, despite all being fixed in `PRODUCT.md`'s stack. The actual hackathon task — reformulate a problem as a technical contradiction, generate ≥3 TRIZ candidates + ≥3 second-method candidates, evaluate all, select one, expose the full reasoning trail as "real, inspectable logic, not a prompt dressed up" — **has 0% implementation**. What exists: a clean Angular 21.2 Nx scaffold (`app.routes.ts` is `[]`, app still renders the default Nx welcome page), a thorough design-token spec, three static Tailwind wireframes (explicitly prototype-only, not shippable), and an unusually rigorous 8-phase frontend implementation plan. `deploy/` is empty; only a frontend `Dockerfile` exists.

## Key Metrics
- **Velocity**: 100% of effort so far on frontend scaffolding/design docs, 0% on graded core logic. One reverted decision (SSR added 10:29, removed 10:51) cost ~20 min.
- **Architecture quality**: high where it exists — standalone/OnPush/signals discipline correctly specified, config-driven fake→real API swap planned, self-critical gap-scans in the plan doc. But it covers only the frontend; backend architecture hasn't started.
- **Scope alignment**: misaligned. `judging_criteria.md` weights Innovation 25p + Usability 10p — both depend on the reasoning engine running — well above Design 10p, where all effort has gone. `deliverables.md`'s pitch-eligibility gate also requires working code (Day 3), an evaluation report (Day 4), and a deployed app (Day 5) — all at 0%.
- **Deployment readiness**: 0%. No backend, no DB, no Cloud Build/Cloud Run config, no TRIZ MCP server.

## First-Principles Check
- **Scope inversion**: heaviest investment (tokens, wireframes, planned ng-diagram integration, WCAG/Lighthouse auditing) targets the lowest-point category (Design, 10p), while the literal task requirement — the TRIZ/second-method/evaluation pipeline — hasn't started. This is the single biggest risk to the outcome.
- **Process over-engineering**: `Hackathon Wiki/` defines a 6-stage, 31-validator stateless-session-memory system, but `Hackathon Wiki/stages/` and `/mindset/` are completely empty — the coordination scaffold exists but was never populated, so it's pure overhead right now.
- **Infrastructure risk**: the git index is corrupted (`git fsck` → "bad index file sha1 signature"). Silent today, but will block a commit or CI push at the worst possible moment.
- **Premature polish**: ng-diagram integration, full contrast computation, and a Lighthouse/scorer baseline are being planned before any working feature exists to polish. Core loop first; polish only with remaining time.

## Coaching Guidance (priority order)
1. **Fix the git index now** (`git fsck`, reindex) — 5 minutes, prevents a worse failure later.
2. **Freeze frontend design-system work at current fidelity.** Ship Screens A–C with tokens applied but skip ng-diagram and the full a11y/Lighthouse audit; render the reasoning trail as a plain list/tree first, upgrade to an interactive diagram only if time remains after the core loop works end-to-end.
3. **Start the reasoning engine immediately** (parallel track if you have a second person): problem→contradiction (logged LLM call) → ≥3 TRIZ candidates (contradiction-matrix lookup + LLM) → ≥3 second-method candidates (pick the simplest to make genuinely stepwise — 5 Whys, not Six Hats, which needs more UI-specific work) → a real scoring function (not just an LLM opinion) → selection. Ship it as a plain script/Express endpoint first; formalize into NestJS only if time remains.
4. **Wire the frontend's planned fake-API layer to the real engine** the moment it emits JSON — don't wait for polish on either side.
5. **Timebox the remaining ~6h45m**: ~2.5h engine core, ~1h evaluation/scoring, ~1.5h frontend integration, ~1h deploy (one Cloud Run service is enough — skip Cloud SQL/pytriz MCP unless trivial), ~1h pitch/demo script, 15–30 min buffer. Checkpoint each hour: "does problem→trail run end-to-end?" If not by hour 4, cut visual scope further — never the engine.
6. **Drop the wiki/validator bureaucracy** for the rest of the day; it isn't paying for itself at this time budget.

## Reasoning Trail (Evidence)
- Commits: `git log` — 16 commits, 09:00–10:55 today; SSR added 10:29 / removed 10:51 (`apps/frontend`).
- No backend: `apps/` = `{frontend, frontend-e2e}` only; repo-wide search for NestJS hits only doc references in `agent_doc/4-backend/*`.
- Wiki gap: `find "Hackathon Wiki/stages"` and `/mindset` return 0 files, despite `START.md`'s trust table marking all 6 stages "in-progress."
- Git corruption: `git fsck --full` → `error: bad index file sha1 signature`.
- Plan's own admission: `doc/frontend-ui-implementation-plan.md` §4 — "does not cover the NestJS backend, TRIZ... or evaluation/scoring algorithm."
- Judging weights vs. status: `doc/judging_criteria.md` (Innovation 25p, Usability 10p, Design 10p) and `doc/deliverables.md` (Day 3 code / Day 4 eval report / Day 5 deployed app, 20p each) — all core-logic items unmet, all design-only items in progress.
