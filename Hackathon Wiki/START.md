---
current-stage: 1-discovery
challenge-assigned: false
---

# START — read this first

This wiki is external memory for stateless AI sessions (Claude plans, Devin executes).
Its only job: a fresh session reads it and reconstructs full project context — same
conclusions, same decisions as prior sessions. Nothing else belongs here.

## Read protocol (every new session, in this order)

1. This file — check `current-stage` and the trust table below.
2. `PRODUCT.md` — fixed facts. Never relitigate them.
3. `GLOSSARY.md` — the only accepted names for things.
4. Every completed stage's `steps/` folder, in stage order — read each step's `## Result`
   section to reconstruct prior decisions.
5. The `current-stage` `steps/` folder — this is where you work.

Do NOT read stages after the current one. They are empty by definition.

## Stage file conventions

Each stage folder has one subfolder:

- `steps/` — one file per step. Each file has three sections in order:
  1. **Task** — what to do, how, recommended tool.
  2. **Gate** — validation checklist.
  3. **Result** — filled in when the step is done. This is the critical context for
     the next AI session.

That's it. No gate/ folder, no stage-level index files, no OUTPUT files. One file per
step, everything in it.

Reference implementation: `stages/1-discovery/`. Stages 2–6 have empty `steps/`
folders — fill them only once the real task breakdown is researched and confirmed,
the same way stage 1's was. Don't pre-create placeholder content (see no-placeholder
rule below).

## Trust table

| Stage | Status |
|---|---|
| 1-discovery | in-progress |
| 2-design-system | in-progress |
| 3-frontend-arch | in-progress |
| 4-backend | in-progress |
| 5-deployment | in-progress |
| 6-ship | in-progress |

Status meanings: `locked` = settled, build on it, never contradict it. `in-progress` =
being decided now. `not-started` = empty, ignore. `invalidated` = an upstream change
broke it; re-verify before trusting anything in it.

## Status mechanics

- Only the human flips a stage to `locked`. AI proposes content; human locks.
- When the real hackathon challenge is assigned: rewrite Stage 1 for the real task
  (move prior content to a `## Superseded` section in the affected task files — never
  silently delete), then flip every downstream `locked`/`in-progress` stage to
  `invalidated` until re-checked against the new Stage 1.
- Any change to a `locked` stage: add a `## Superseded` section to the affected task
  file with a dated note saying what replaced it and why. Update the trust table here
  in the same edit.

## Rules for AI (hard limits)

- AI never decides: final scope, persona, problem statement, design token values, Nx or
  NestJS module boundaries, IAM/env/prod config, eval criteria. AI proposes; human decides.
- One fact, one home. Never copy a fact from one file into another — link it.
- Never write placeholder entries ("n/a", "TBD" rows). Empty sections stay empty.
- Never invent a name not in `GLOSSARY.md`. Need a new name? Add it there first.
- Devin: if a task requires crossing a locked boundary, stop and flag — don't improvise.

## Setup when the challenge starts (do this first)

Commit this entire folder into the product repo as `/wiki` so Devin reads
`wiki/START.md` directly — no pasting. Obsidian keeps pointing at the same folder.
Set `challenge-assigned: true` above and fill `PRODUCT.md`'s repo field.

## Agent harness rules (current-state — fill only when real rules exist)

_(none yet)_

## Known prompt/context failure patterns (fill only from real failures)

_(none yet)_
