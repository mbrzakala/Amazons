---
stage: 1-discovery
task: 6
---

# 6. Kanban Board

**What to do:** Translate the persona, problem statement, process map, and step 5's
MVP scope into concrete implementation tickets, sorted by status.

**How:**
1. One ticket per MVP-labeled step from step 5.
2. Write each ticket as title + one-line description.
3. Sort tickets into three columns: To Do, Doing, Done. Everything normally starts in To
   Do at this point — that's expected, not a gap.

**Recommended tool:** Kanban Lite (`npx kanban-lite`) — cards are plain `.md` files you
can git commit, has an MCP server so AI can read and update the board, and a web UI for
humans. No database, no SaaS, no account. If it disappears, your board is still just
markdown files.

## Gate

- [ ] Every MVP-labeled step from step 5 maps to at least one ticket.
- [ ] Each ticket has a title and a one-line description.
- [ ] Tickets are sorted into To Do / Doing / Done.
- [ ] All tickets start in To Do (Doing and Done empty at this point is a pass, not a
      gap).

Last task — once it passes, the stage is done.

## Result

One ticket created per MVP-labeled step from [[5-mvp-scope]], via `npx kanban-lite`
(cards are git-committed `.md` files under `.kanban/boards/default/todo/`). All start
in **To Do**:

| Ticket | Title | Maps to MVP step |
|---|---|---|
| #7 | Problem input endpoint | 1. Inventive problem submitted |
| #8 | Contradiction reformulation step | 2. Problem reformulated as technical contradiction |
| #9 | TRIZ candidate generation | 3. TRIZ-based candidate solutions generated |
| #10 | Brainstorming candidate generation | 4. Second-method (LLM brainstorming) candidates generated |
| #11 | Candidate evaluation (LLM judge) | 5. All candidates evaluated |
| #12 | Best candidate selection | 6. Best candidate solution selected |
| #13 | Reasoning trail delivery | 7. Recommended solution + reasoning trail delivered |

These are separate from the pre-existing `#1 "Stage 1: Discovery"` card, which tracks
the meta-progress of this discovery stage itself, not the product's feature backlog.

Stage 1 is complete.
