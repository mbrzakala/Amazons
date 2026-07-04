# Chunk 12 — Reformulation Cards (TRIZ + Generic + Six Hats Grid)

## Depends on
Chunk 04 (`Card`), 05 (`StatusChip`), 01 (tokens).

## Context recap
Screen B has two reformulation cards side by side. The **TRIZ card** (`wireframe_solution_pipeline/code.html`) shows three labeled sub-blocks: `IMPROVING PARAMETER` (e.g. "#14: Degree of automation"), `WORSENING PARAMETER` (e.g. "#36: Complexity of device"), and a `CONTRADICTION STATEMENT` italic sentence, each label in `label-caps`, values in `label-mono` (parameters) or `body-md` italic (statement). The **second method's card** in the wireframe is Six Thinking Hats: a 2×3 grid of mini-cards, each with a colored swatch, `label-caps` hat name, and a short note, with the currently-synthesizing hat given a 2px `--color-primary` border. Per the master plan, keep these method-agnostic where reasonably possible so a future method swap doesn't require rebuilding Screen B wholesale — but the hat grid is inherently Six-Hats-specific and that's an accepted, scoped exception, not something to force into a generic shape.

## Task
1. Build `apps/frontend/src/app/features/solution-pipeline/triz-reformulation-card/` — standalone, `OnPush`, `input()` for the TRIZ reformulation data (improving/worsening parameter strings, contradiction statement string) and a `StatusChip` showing Done/Running based on an input status.
2. Build a slightly more generic `apps/frontend/src/app/features/solution-pipeline/method-reformulation-card/` wrapper if useful — or skip it and let each method render its own card directly inside `Card` from chunk 04; don't force an abstraction that doesn't fit, document whichever choice is made in a code comment for the next person.
3. Build `apps/frontend/src/app/features/solution-pipeline/six-hats-grid/` — standalone, `OnPush`, `input()` for an array of 6 hat entries (`{ hat: 'white'|'red'|'black'|'yellow'|'green'|'blue', note: string }`), rendering the color swatch + label per hat, with the "active/focus" hat (an input flag, e.g. `focusHat: HatColor`) getting the 2px primary border treatment.

## Files to create/modify
- `apps/frontend/src/app/features/solution-pipeline/triz-reformulation-card/` (new)
- `apps/frontend/src/app/features/solution-pipeline/six-hats-grid/` (new)
- (optional) `apps/frontend/src/app/features/solution-pipeline/method-reformulation-card/`

## Out of scope
- Do not fetch any data or wire to `SolveSessionService`/fake API here — pure presentational components taking data via `input()`. Wiring happens in chunk 14.
- Do not build the solution cards/stack (chunk 13).

## Definition of done
- [ ] Both card types are standalone, `OnPush`, `input()`-driven, tokens-only styling.
- [ ] TRIZ card's three sub-blocks match the wireframe's labels and typography exactly.
- [ ] Six Hats grid renders all 6 hats with correct swatch colors and the focus-hat 2px border treatment, verified live.

## Handoff
Chunk 14 composes these two components with real data from `SolveSessionService`/the fake API layer (chunk 11).
