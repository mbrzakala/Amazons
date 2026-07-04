# Chunk 03 — `ng-diagram` Install & API Verification

## Depends on
Nothing. Independent — can run any time before chunk 16, in parallel with 01/02.

## Context recap
Screen C's "Reasoning Trail (NGD)" must be built with the **`ng-diagram`** Angular library (this is what "NGD" in the wireframe refers to) — global stylesheet import, `provideNgDiagram()` on the hosting component, all node/edge writes through `NgDiagramModelService` (`updateNodes([...])`/`updateEdges([...])` for batches, never direct array mutation). This plan was written without direct access to the library's live docs, so its exact package name/API must be confirmed now, not assumed.

## Task
1. Find and install the correct npm package for `ng-diagram` (search npm/GitHub for the Angular interactive node/edge diagram library matching this name; confirm it's Angular-compatible with this workspace's Angular version, ~21.2).
2. Read its real documentation and confirm/correct these specific assumptions, writing the actual findings into `doc/ng-diagram-api-notes.md`:
   - Exact import path for the global stylesheet.
   - Exact provider function name and where it must be registered (component-level `providers` vs. app-level).
   - The service name and method signatures for adding/updating nodes and edges (confirm `NgDiagramModelService`, `updateNodes`, `updateEdges` are the real names, or record the real ones if different).
   - Whether it supports orthogonal/elbow edge routing natively (the design system forbids curved connector paths) — if not natively supported, note what custom edge renderer approach is needed.
   - Whether custom node templates (arbitrary Angular component content inside a node) are supported, and how.
3. Do not write any diagram-rendering code yet — this chunk is verification + notes only.

## Files to create/modify
- `package.json` / lockfile (dependency added)
- `doc/ng-diagram-api-notes.md` (new)

## Out of scope
- Do not build the reasoning-trail component here — that's chunk 16.
- Do not touch `styles.scss`'s token block from chunk 01.

## Definition of done
- [ ] The package is installed and importable in a throwaway test file that compiles/builds successfully.
- [ ] `doc/ng-diagram-api-notes.md` documents the real provider name, service name/methods, stylesheet import path, and orthogonal-routing/custom-node-template support, each confirmed against the library's actual docs (link the source).
- [ ] If any assumption in the master plan (`doc/frontend-ui-implementation-plan.md` §3/§4) turns out wrong, that mismatch is called out explicitly in the notes file.

## Handoff
Chunk 16 builds the actual diagram using exactly the names/APIs recorded here — not the placeholder names used elsewhere in this plan.
