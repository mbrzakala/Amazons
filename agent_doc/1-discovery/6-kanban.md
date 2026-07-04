---
stage: 1-discovery
step: 6
source: Hackathon Wiki/stages/1-discovery/steps/6-kanban.md
---

# Validator — 6. Kanban Board

Checks: `Hackathon Wiki/stages/1-discovery/steps/6-kanban.md`.

## What this step is proving

The MVP scope from step 5 has been turned into concrete, tracked tickets — one per
MVP-labeled step, sorted by status — closing out stage 1.

## Evidence to gather

- The step-5 MVP-labeled scope list.
- The Kanban Lite board: card files (plain `.md` files, git-committed) if the
  recommended tool (`npx kanban-lite`) was used, or whatever board/tool the team
  actually used instead.

## Gate checklist

1. **Every MVP-labeled step from step 5 maps to at least one ticket.**
   Evidence: compare the MVP list against ticket titles. Fail if any MVP item has no
   corresponding ticket.
2. **Each ticket has a title and a one-line description.**
   Evidence: ticket contents. Fail if any ticket is title-only or missing a
   description.
3. **Tickets are sorted into To Do / Doing / Done.**
   Evidence: board columns/status field.
4. **All tickets start in To Do** (Doing and Done empty at this point is a pass, not a
   gap).
   Evidence: board state at the time stage 1 closes.

See `agent_doc/README.md` for the verdict scale and reporting format.
