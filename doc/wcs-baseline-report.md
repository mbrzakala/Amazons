# WCS Baseline Report

## Status: Pending Live Run

The WCS baseline eval (`run-task.ps1 0` from `wcs-edd/`) must be executed against the running frontend app to generate a real numeric score. This document will be updated with the results once the eval is run.

## How to Run

```powershell
# Start the frontend dev server first
# Then from the wcs-edd directory:
.\run-task.ps1 0
```

Or:

```bash
./run-task.sh 0
```

## Results

_To be filled in after live run:_

| Rating | Score | Pass/Fail | Notes |
|--------|-------|-----------|-------|
| _Overall_ | _TBD_ | _TBD_ | _TBD_ |
| _Per-rating breakdown_ | _TBD_ | _TBD_ | _TBD_ |

## Current Project State (Pre-Eval)

- **Nx workspace**: 2 projects — `frontend` (type:app) and `frontend-e2e` (type:e2e). No shared libraries yet.
- **Nx boundaries**: `depConstraints` configured in root `eslint.config.mjs` — `type:app` constrained to depend on `type:feature`/`type:ui`/`type:data-access`/`type:util`; `type:e2e` constrained to `type:app`.
- **Design tokens**: All UI components use CSS custom properties from `styles.scss` — no hardcoded hex/px values in component styles.
- **Three screens**: Problem Input (Screen A), Comparison Pipeline (Screen B), Evaluation & Reasoning Trail (Screen C).
- **Accessibility**: `aria-label` on all icon buttons, `aria-live` on error messages, `role="status"` on dynamic updates, keyboard focus-visible outlines on all interactive elements. Contrast audit in `doc/accessibility-contrast-audit.md` — all 5 pairs pass WCAG AA.
- **Signals-only**: No `.subscribe()` + manual field assignment — all state managed via `signal()`/`computed()`.
- **ng-diagram**: Reasoning trail uses `ng-diagram@1.2.4` with orthogonal edge routing, custom node templates, batch `updateNodes`/`updateEdges` calls.
