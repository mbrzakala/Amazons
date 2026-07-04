---
stage: 3-frontend-arch
step: 1
source: Hackathon Wiki/stages/3-frontend-arch/steps/1-nx-dependency-graph.md
---

# Validator — 1. Nx Dependency Graph & Workspace Boundaries

Checks: `Hackathon Wiki/stages/3-frontend-arch/steps/1-nx-dependency-graph.md`.

## What this step is proving

The team looked at their actual Nx dependency graph and put a real (non-wildcard)
module boundary rule in place once a second project existed, with no library importing
back into the app.

## Evidence to gather

- `nx graph` output (run it, or check for an exported `graph.html`/screenshot).
- The root ESLint config's `depConstraints`/`sourceTag` rule.
- Each project's `project.json` `tags` field.
- Git log for `nx g @nx/angular:library` commits vs. hand-created library folders.

## Gate checklist

1. **`nx graph` has been run at least once and the team has looked at it together.**
   Evidence: graph output/screenshot, or team self-report.
2. **The boundary rule is no longer the default wildcard once a second project exists —
   real tags are in place.**
   Evidence: ESLint `depConstraints` config. Fail if it's still `sourceTag: "*"` with
   ≥2 projects.
3. **Every arrow in the graph points one direction only (app → lib); no library imports
   back into the app.**
   Evidence: `nx graph` output.
4. **Any new library was generated via `nx g`, not created by hand.**
   Evidence: `project.json` tags consistency and git history — hand-created libs
   typically lack generator-consistent tags/config.

Corresponding Result/DoD (once filled): a non-wildcard `depConstraints` rule matching
the `nan-stack` reference shape exists in the root ESLint config, and every project has
a real `tags` entry.

See `agent_doc/README.md` for the verdict scale and reporting format.
