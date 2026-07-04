---
stage: 1-discovery
step: 4
source: Hackathon Wiki/stages/1-discovery/steps/4-process-map.md
---

# Validator — 4. Process Map (Event Storming)

Checks: `Hackathon Wiki/stages/1-discovery/steps/4-process-map.md`.

## What this step is proving

The team mapped the core flow satisfying the step-3 problem statement using real Event
Storming discipline (domain events, not commands/UI/CRUD steps), run silent-first so one
voice didn't anchor the board.

## Evidence to gather

- The FigJam board (Hackathon board), or an export/screenshot/recorded event list in the
  step's `## Result` section.
- The task-3 problem statement and task-2 persona, for cross-checking event grain and
  actor naming.
- Team self-report on whether the silent round happened before discussion (this can't be
  verified from the board alone after the fact).

## Gate checklist

1. **At least 3 domain events are listed, each in short past tense** (e.g. "Order
   placed").
   Evidence: event list. Fail if any event is present tense or an imperative/command
   ("Send email").
2. **Every event is a business-meaningful fact, not a technical/CRUD/UI-level action.**
   Evidence: event list. Fail on things like "Database updated," "Button clicked."
3. **Events are ordered chronologically and cover the persona's path from problem to
   relief, core happy path only.**
   Evidence: event sequence. Fail if error branches/edge cases are mixed in, or the path
   doesn't start near the persona's pain point and end at relief.
4. **No duplicate events remain; anything that was actually two events has been split.**
   Evidence: event list, look for near-duplicates or overly coarse events.
5. **Every event has a named actor** (a role, e.g. "Customer," not a person's name).
   Evidence: actor stickies/labels per event.
6. **Any disagreement or unknown surfaced during the exercise is recorded as a
   hotspot** — not silently dropped or silently resolved.
   Evidence: hotspot stickies/notes on the board.
7. **The silent/parallel writing round happened before group discussion.**
   Evidence: team self-report (yes/no) — fail if the team confirms the board was built
   by open discussion from the start.
8. **Events describe this product's actual process, not a generic example.**
   Evidence: compare events against the task-1 idea/task-2 persona — fail if the events
   read like a textbook example (e.g. generic e-commerce checkout) unrelated to the
   actual product.
9. **Method used is Event Storming**, matching `PRODUCT.md` → Process method.
   Evidence: confirm no other method (e.g. BPMN) was substituted.

See `agent_doc/README.md` for the verdict scale and reporting format.
