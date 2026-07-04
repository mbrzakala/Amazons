---
stage: 6-ship
step: 3
source: Hackathon Wiki/stages/6-ship/steps/3-demo-script-and-pitch.md
---

# Validator — 3. Demo Script & Pitch

Checks: `Hackathon Wiki/stages/6-ship/steps/3-demo-script-and-pitch.md`.

## What this step is proving

The 5-minute pitch is scripted around the verified core flow (not every feature
built), fits the event's actual time limit, has been rehearsed at least once, every
team member has an assigned speaking part, and the live demo runs against deployed
URLs.

## Evidence to gather

- The event's Discord rules doc, for the actual time limit and slide/speaking
  policy — team self-report is fine if the doc itself isn't accessible to the
  validator.
- The written script/slides.
- A rehearsal timing note (actual clocked run, not an estimate).
- The speaking-part assignment per team member.
- Confirmation the demo plan references deployed URLs, not localhost.

## Gate checklist

1. **The pitch fits inside the actual time limit, rehearsed at least once.**
   Evidence: rehearsal timing note against the event's real limit — team self-report if
   no recording exists.
2. **The demo shows the verified core flow, not an aspirational or broken feature.**
   Evidence: script content cross-checked against the step-2 (6-ship) smoke-test
   result.
3. **Every team member has an assigned speaking part, per the event's rules.**
   Evidence: the speaking-part assignment.
4. **The live demo runs against deployed URLs, not localhost.**
   Evidence: script/plan referencing the deployed frontend URL.

See `agent_doc/README.md` for the verdict scale and reporting format.
