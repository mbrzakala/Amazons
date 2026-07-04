---
stage: 3-frontend-arch
task: 1
---

# 1. Nx Dependency Graph & Workspace Boundaries

**What to do:** Generate the Nx dependency graph for the team's actual workspace and put a real (non-wildcard) boundary rule in place before more than one library exists.

**How:**
1. Run the graph on the team's own workspace and eyeball which apps/libs import which.
2. The default boundary rule (`sourceTag: "*"`) allows anything — tighten it as soon as a second project (app or lib) exists, don't leave it as a no-op.
3. When extracting a shared library, generate it with the Nx generator (not by hand) so `project.json` tags stay consistent: `nx g @nx/angular:library <name> --directory=libs/<name>`.
4. Re-run the graph after adding any library. If an arrow points back from a library into the app, that's a boundary violation — restructure now (2 minutes), don't bypass the rule under time pressure.

**Recommended tool:** `nx graph` (built into Nx, zero setup). Backup: `nx graph --file=graph.html` to export a static file if the live view won't open; a manual folder-tree comment in the README (`apps/` vs `libs/`) only as a worst-case fallback.

## Gate

- [ ] `nx graph` has been run at least once and the team has looked at it together.
- [ ] The boundary rule is no longer the default wildcard once a second project exists — real tags are in place.
- [ ] Every arrow in the graph points one direction only (app → lib); no library imports back into the app.
- [ ] Any new library was generated via `nx g`, not created by hand.

Next: [[2-standalone-component]].

## Result

**Scope:** Establish real Nx module boundaries (tags + `depConstraints`) for the team's workspace before it grows past one app.

**DoD:**
- [ ] At least one non-wildcard `depConstraints` rule exists in the root ESLint config, matching the tag-based shape used by the studied `nan-stack` reference (e.g. `api` / `app` / `scope:frontend`).
- [ ] Every app/lib project has a real `tags` entry in its `project.json` (not left at generator defaults).
- [ ] `nx graph` shows no back-edges from a library into the app.

**Layers:** infra: Nx workspace config, module boundaries.
