# 5-Min Pitch — TRIZ Reasoning Software for R&D
### Client: R&D department — live case: Problem 6, Desalination (SDG 6/7)
Pace: ~1 min per chunk.

---

## 1. YOUR PAIN

- Your researchers vet inventive problems before betting budget on a fix.
- Case in point: desalination. More freshwater out, without energy or equipment cost climbing with it.
- Right now, solving that means: TRIZ contradiction analysis, by hand.
- Then a second ideation method, also by hand.
- Then defending one final pick among candidates — alone, no record, no trail.
- Days of your best engineer's time. Every problem. Every time.

## 2. WHY IT'S HARD

- TRIZ itself isn't the bottleneck — the matrix has answers. Applying it is.
- Someone has to translate your messy real problem into the right two parameters, out of 39.
- Then search a 39×39 matrix by hand for the principles that fit.
- Then turn an abstract principle ("segmentation," "do it in reverse") into an actual engineering candidate.
- Then repeat the whole thing with a second method, so you're not betting on one lens.
- Then score every candidate and defend the pick — to whoever signs off on the budget.
- Skip steps, you move fast but can't defend the answer. Do it properly, it takes days. No version of "by hand" gives you both speed and a trail.

## 3. OUR SOFTWARE

Your problem in. A defended recommendation out. Every step on the record.

1. Your problem → reformulated as a technical contradiction
2. TRIZ candidates pulled from the real contradiction matrix — ≥3 principles
3. Second method — LLM brainstorming — ≥3 more candidates
4. Every candidate scored and justified against your original problem
5. One candidate selected, with reasons
6. Full trail delivered: problem → contradiction → candidates → evaluation → choice

## 4. LIVE ON YOUR PROBLEM — DESALINATION

Same software, run live on the challenge you gave us:

- Your contradiction, found automatically: more permeate out ↔ same energy in, same equipment strain.
- TRIZ side: isobaric pressure exchangers, batch RO, waste-heat reuse — straight from the matrix.
- Brainstorm side: solar-matched RO, FO-RO hybrid, brine-to-energy recovery.
- Scored, justified, one candidate chosen — nothing hidden from you.
- Numbers behind the picks are real: pressure exchangers cut pump load ~60%; batch RO hits 82.6% recovery at 3.3 kWh/m³; FO-RO hybrids run under 1 kWh/m³.

## 5. WHY YOU CAN TRUST IT

- TRIZ data is the real thing: `pytriz` — 39 parameters, 40 principles, the actual matrix. We didn't invent it, we made it usable.
- Your plain-English problem gets matched to the official parameter by semantic search — no guesswork on the way in.
- Six separate, callable tools, not one prompt dressed up — you can inspect any single step.
- Deployed, not a demo trick: frontend, backend, TRIZ server, live and talking to each other for real.
- Bring your next problem — same software, same rigor, no re-tooling.

## 6. PUNCHLINE

- Your bottleneck was never the method. It was the hours it took one expert to run it.
- We didn't invent TRIZ. We put it on your desk — fast, visible, defensible.
- Bring the next inventive problem. It reasons it out, on demand.
