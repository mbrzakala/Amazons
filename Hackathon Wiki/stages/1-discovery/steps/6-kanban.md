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
