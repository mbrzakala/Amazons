# 5-Min Pitch — Reasoning Engine for Inventive Problems

### Problem 6: Desalination (SDG 6/7) — Team 206D, Amazons

Pace: ~1 min per chunk.

---

## 1. THE PAIN

- R&D architect. Vets big-budget technical proposals before they ship.
- Today's process: run TRIZ contradiction analysis — by hand.
- Then a second ideation method — also by hand.
- Then justify one final pick among candidates — alone, no trail, no audit.
- Result: days of expert time. Every problem. Every time.

_So the client doesn't need more ideas. They need the process done fast — and shown, not just claimed._

## 2. THE PROBLEM STATEMENT

- Case: desalination. Ocean = ultimate water source. Undrinkable as-is.
- Fix exists — reverse osmosis. Cost: heavy energy, heavy equipment wear.
- Contradiction: more freshwater out ↔ same energy in, same equipment strain.
- Textbook TRIZ shape — improve one parameter, another one degrades.

_This is exactly the kind of problem our engine is built to take in._

## 3. OUR PRODUCT

End to end. Problem in. Solution out. Full trail visible.

1. Problem → reformulated as a technical contradiction (system, not guesswork)
2. TRIZ candidates — contradiction matrix, ≥3 principles
3. Second method — LLM brainstorming, ≥3 more candidates
4. Every candidate scored + justified against the original problem
5. One candidate chosen, defended
6. Full trail handed back: problem → contradiction → candidates → evaluation → choice

_Every one of those six is a real step you can inspect — not one prompt wearing a structured costume._

## 4. WHY IT'S REAL

- TRIZ data is real: `pytriz` package — 39 parameters, 40 principles, the actual matrix. Nothing invented.
- Plain-English input matched to the official parameter via semantic search — no guesswork going in either.
- Six separate, callable tools. Each one inspectable alone, each one testable alone.
- Deployed, not staged: frontend, backend, MCP server — live on Cloud Run, talking to each other for real.
- Mechanism is general — swap in any inventive problem, same engine, same rigor.
- Proof on this problem: candidates grounded in real levers — pressure exchangers cutting pump load ~60%, batch RO at 82.6% recovery / 3.3 kWh/m³, FO-RO hybrids under 1 kWh/m³. Not hypothetical.

## 5. PUNCHLINE

- The ocean was never short on water. It's short on the time and expertise to unlock it.
- We didn't invent TRIZ. We put it to work — visibly, in minutes, on demand.
- Same engine, any inventive problem. Point it. It reasons — out loud.