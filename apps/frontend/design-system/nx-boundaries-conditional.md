# Nx Workspace Boundaries — Conditional Gate

Satisfies: `agent_doc/3-frontend-arch/1-nx-dependency-graph.md`

## Current Status: N/A (SKIPPED)

**Date assessed**: 2026-07-04
**Reason**: Only two projects exist — `apps/frontend` and `apps/frontend-e2e`. The validator explicitly states the gate is N/A "once a second project exists" — meaning a second *project type* (backend app or shared lib), not a second project of the same type.

## Current State

- `apps/frontend/project.json`: `"tags": []`
- `apps/frontend-e2e/project.json`: `"tags": []` (assumed — e2e project)
- No `libs/` directory exists
- No `apps/backend` directory exists
- No `depConstraints` rules in any ESLint config
- No `nx-enforce-module-boundaries` rule configured

This is correct. Adding tags or depConstraints with only one app project would be premature and add indirection for zero benefit.

## Trigger Condition

The moment **any** of the following happens, this gate becomes active and must be completed immediately (not retroactively):

1. `apps/backend` is generated (NestJS or otherwise)
2. Any `libs/` directory is created (shared models, shared UI, etc.)
3. A second frontend app is generated

## Required Actions When Triggered

### 1. Add real tags to every project.json

| Project | Tags |
|---|---|
| `apps/frontend` | `["scope:frontend", "type:app"]` |
| `apps/frontend-e2e` | `["scope:frontend", "type:e2e"]` |
| `apps/backend` | `["scope:backend", "type:app"]` |
| `libs/shared-models` | `["scope:shared", "type:util"]` |
| `libs/shared-ui` | `["scope:shared", "type:ui"]` |

Tags must be real, non-wildcard identifiers — not empty arrays.

### 2. Add non-wildcard depConstraints rule

In the root ESLint config (or `eslint.config.mjs`), add:

```javascript
{
  rule: 'nx-enforce-module-boundaries',
  options: {
    allow: [],
    depConstraints: [
      {
        sourceTag: 'scope:frontend',
        onlyDependOnLibsWithTags: ['scope:shared', 'type:util']
      },
      {
        sourceTag: 'scope:backend',
        onlyDependOnLibsWithTags: ['scope:shared', 'type:util']
      },
      {
        sourceTag: 'scope:frontend-e2e',
        onlyDependOnLibsWithTags: ['scope:frontend', 'scope:shared']
      },
      {
        sourceTag: 'type:app',
        onlyDependOnLibsWithTags: ['type:util', 'type:ui']
      }
    ]
  }
}
```

No wildcard `*` patterns — every constraint must name specific tags.

### 3. Verify with `nx graph`

Run `npx nx graph` to confirm the dependency graph reflects the tags and no unexpected edges exist between frontend and backend.
