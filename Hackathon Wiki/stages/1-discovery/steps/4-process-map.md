---
stage: 1-discovery
task: 4
---

# 4. Process Map (Event Storming)

**What to do:** Map the core flow of the product that satisfies the task 3 problem
statement, using Event Storming — the process method fixed in [[PRODUCT]] → Process
method. Output: an ordered sequence of domain events, each with a triggering actor, plus
any hotspots (open questions/disagreements).

**What a domain event is:** A business-meaningful fact that already happened, short past
tense — "Order placed," not "Place order" (command) or "Order is placed" (present
tense). Not a technical/CRUD/UI step ("Database updated," "Button clicked" don't
count). Right grain: not so coarse it hides what happened ("Order processed"), not so
fine it's a UI click. Test: would the persona (task 2) describe this as a distinct thing
that happened to them? Unsure if it's one event or two — write two; merging later is
cheap, missing a step later is expensive.

**How, in FigJam on the Hackathon board (everyone on their own laptop):**
1. Silent round, 5 min: each person adds their own domain events as stickies — press
   **S**, click, type, **Ctrl+Enter** for the next — no talking, anywhere on the canvas.
   This step is what makes the exercise work: talking first lets the loudest voice
   anchor everyone, and whatever only a quiet member knew gets lost.
2. As a group, drag every sticky into one left-to-right timeline: merge duplicates,
   split anything that's really two events, fix the order.
3. Walk it once more for gaps — between any two events, ask "does something have to
   happen in between?" Add what's missing.
4. For each event, add a small sticky naming its actor (a role — "Customer," not
   "John"). Give actor stickies a different color (color swatch at the top of the
   sticky toolbar) so they read apart from events at a glance.
5. Any disagreement or unknown → a third color, placed at that point on the timeline.
   Don't resolve it now — park it and keep moving; carry it into tasks 5–6 if unresolved.
6. Core happy path only — no error branches yet.

**Good vs. bad:** "Order placed" → "Payment authorized" → "Stock reserved" → "Order
shipped" — each a fact, past tense, one thing. Bad: "Order handled" (too coarse, hides
what happened), "Customer typed shipping address" (too fine, UI-level), "Send
confirmation email" (that's a command — reword "Confirmation email sent"). Bad process
even with clean-looking stickies: skipping the silent round and letting one person talk
first — the board ends up missing whatever only the quiet people knew.

**Recommended tool:** FigJam, the Hackathon board — **S** for sticky, **Ctrl+Enter** to
chain the next one, a second sticky color for actors, a third for hotspots. Optional:
ask Claude to check the finished event list against the domain-event rules above and
flag anything that's really a command, a UI action, or CRUD instead of an event.

## Gate

- [ ] At least 3 domain events are listed, each in short past tense (e.g. "Order
      placed") — fails if any is present tense or an imperative/command ("Send email").
- [ ] Every event is a business-meaningful fact, not a technical/CRUD/UI-level action
      (fails on things like "Database updated," "Button clicked").
- [ ] Events are ordered chronologically and cover the persona's path from problem to
      relief, core happy path only — no error branches or edge cases.
- [ ] No duplicate events remain; anything that was actually two events has been split.
- [ ] Every event has a named actor (a role, e.g. "Customer," not a person's name).
- [ ] Any disagreement or unknown surfaced during the exercise is recorded as a hotspot
      — not silently dropped and not silently resolved without a note.
- [ ] The silent/parallel writing round happened before group discussion (team confirms
      yes/no) — fails if the board was built by open discussion from the start.
- [ ] Events describe this product's actual process, not a generic example.
- [ ] Method used is Event Storming, matching [[PRODUCT]] → Process method.

Next: [[5-mvp-scope]].

## Result
*(AI first-draft, simplest happy-path pass only — team still owes a quick silent
check against it before this can be marked done; see note below)*

Two actors used: **R&D Researcher** (human) and **System** (the product, for
automated/computed steps).

1. Inventive problem submitted — R&D Researcher
2. Problem reformulated as technical contradiction — System
3. TRIZ-based candidate solutions generated — System
4. Second-method candidate solutions generated — System
5. All candidates evaluated against the original problem — System
6. Best candidate solution selected — System
7. Recommended solution and reasoning trail delivered to researcher — System

**Hotspots:**
- Second concept-generation method (alongside TRIZ) not yet chosen — source notes only
  say "e.g. 5 Whys," undecided.
- Evaluation/scoring criteria for comparing candidates against the original problem is
  not yet defined.

**Gate item 7 (silent round) — not yet satisfiable by AI:** this list was drafted by AI
from tasks 1–3, not built on the FigJam board. Before locking, the team should spend ~2
quiet minutes independently checking/editing this list (or writing their own first) so
the exercise isn't anchored on the AI draft, then self-report yes/no on the gate.

Next build-on steps (deliberately deferred, not done in this pass): pivotal
events/zoning into bounded contexts, commands, and error branches — add these once the
happy path above is confirmed.
