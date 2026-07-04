---
stage: 1-discovery
task: 5
---

# 5. MVP Scope

**What to do:** From the step 4 process map, decide what's shippable for the MVP and
what's deferred.

**How:**
1. Go through the process map. Mark each step: MVP or Later.
2. Cut anything that's not essential to prove the core value. MVP is the smallest thing
   that proves the product works.
3. If you're unsure about a step, cut it — you can always add it back. Scope creep kills
   hackathon projects.

**Recommended tool:** Mark up the step 4 diagram directly (color or label), then write
the scoped list here. Backup: paste the MVP scope into Claude or ChatGPT and ask it to
argue for cutting more — use the pushback to pressure-test, not replace, the team's
judgment.

## Gate

- [ ] Every step from step 4 is labeled MVP or Later.
- [ ] The MVP is the smallest set of steps that proves the core value — nothing extra.

Next: [[6-kanban]].

## Result

Scope decision (per team): ship **Release 1 only** from the user story map — Release
2/3 items (interactive editors, `pytriz` MCP integration, MCDA) are cut for the
hackathon, not just deferred within this step.

**Process map (step 4) labeling — all 7 steps are MVP; none are cut**, since each is
either required by the contest task itself or needed to present the full reasoning
trail:

| # | Step 4 event | Label | Why |
|---|---|---|---|
| 1 | Inventive problem submitted | **MVP** | Entry point — nothing to demo without it. |
| 2 | Problem reformulated as technical contradiction | **MVP** | Contest requires the contradiction to be an explicit, inspectable step. |
| 3 | TRIZ-based candidate solutions generated | **MVP** | Contest requires TRIZ as one of the two methods, ≥3 candidates. |
| 4 | Second-method (LLM brainstorming) candidates generated | **MVP** | Contest requires a second method, ≥3 candidates. |
| 5 | All candidates evaluated (single LLM judge score, 1–5, + justification) | **MVP** | Contest requires evaluation against the original problem. |
| 6 | Best candidate solution selected | **MVP** | Contest requires a final choice. |
| 7 | Recommended solution + reasoning trail delivered | **MVP** | Contest requires the full trail (problem → contradiction → candidates → evaluation → choice) to be presented. |

**Later (explicitly out of scope for the hackathon MVP)** — from the user story map's
Release 2/3 columns, kept here only for traceability of the Release-1-only decision:
- Predefined SDG problem picker / external report ingestion (Release 2/3, task
  "Wprowadzenie opisu wyzwania").
- Editable contradiction form / interactive contradiction diagram (Release 2/3).
- Interactive TRIZ matrix preview UI / `pytriz` MCP integration (Release 2/3).
- Structured 5 Whys tree UI, multiple alternative-method choice (Release 2/3).
- Manual score-correction form, criteria weighting, full MCDA panel (Release 2/3).
- Side-by-side alternative-path comparison / variant diagramming (Release 3).
- Dedicated inspectable sub-pages per step, PDF report export, shareable links, Miro/
  Google Sheets export (Release 2/3).

This is the smallest set that still lets the core value — "problem in, evaluated
AI-reasoned solution out, with a visible trail" — be demonstrated end-to-end.
