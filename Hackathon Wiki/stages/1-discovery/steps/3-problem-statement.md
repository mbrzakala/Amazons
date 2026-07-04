---
stage: 1-discovery
task: 3
---

# 3. Problem Statement

**What to do:** Turn the persona into one testable sentence: "[Persona] needs a way to
[need], because [pain point]."

**How:**
1. Fill the canvas fields: who (persona), what they need, why (root cause/pain), what
   exists today and why it falls short.
2. Compress them into the one-sentence problem statement.
3. Confirm the sentence names a need, not a solution — "needs a way to find X" is a
   problem; "needs an AI app that does X" is already a solution.

**Recommended tool:** Fill it in directly. Backup: ask Claude to check whether the
draft sentence smuggles in a solution, and suggest a reworded, solution-free version.

## Gate

- [ ] All four canvas fields (who, what they need, why, what exists today) are filled
      in with specifics.
- [ ] The problem statement follows the exact form: "[Persona] needs a way to [need],
      because [pain point]."
- [ ] The statement names a need, not a solution (fails if it contains "an app that",
      "an AI that", or similar solution language).
- [ ] Someone unfamiliar with the idea could judge pass/fail against this sentence
      alone.

Next: [[4-process-map]].

## Result
*(Team-confirmed)*

- **Who:** David Holz, Senior Systems & Solution Architect at a global humanitarian R&D
  lab (see [[2-persona]]).
- **What they need:** a way to turn an inventive/technical problem (e.g. improving
  desalination efficiency) into an evaluated, evidence-backed solution recommendation,
  generated using TRIZ plus a second ideation method.
- **Why (root cause/pain):** running a TRIZ contradiction analysis and a second ideation
  method by hand, then evaluating and justifying a choice among the candidates, is slow
  and requires expertise he has to apply manually every time, delaying decisions on
  field-ready proposals.
- **What exists today and why it falls short:** TRIZ contradiction matrices and other
  ideation techniques exist as manual references/textbooks; no tool combines them with
  AI to generate, evaluate, and explain candidate solutions end-to-end.

**Problem statement:** David Holz needs a way to turn an inventive problem into an
evaluated, evidence-backed solution recommendation using TRIZ and a second ideation
method, because doing this by hand is slow and expertise-heavy, and no existing tool
combines AI with TRIZ to generate and justify candidates end-to-end.
