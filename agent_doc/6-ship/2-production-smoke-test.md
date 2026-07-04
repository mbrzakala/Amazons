---
stage: 6-ship
step: 2
source: Hackathon Wiki/stages/6-ship/steps/2-production-smoke-test.md
---

# Validator — 2. Production Smoke Test

Checks: `Hackathon Wiki/stages/6-ship/steps/2-production-smoke-test.md`.

## What this step is proving

The product's core flow was actually run to completion on the deployed (not local)
URLs, every blocker found was fixed and re-verified (or explicitly triaged as
non-blocking), and the full flow was re-run after the last fix rather than assumed
still working.

## Evidence to gather

- A walkthrough record/notes of the core flow run against the live deployed frontend
  URL.
- A bug/blocker list with resolution status for each item found during the walkthrough.
- Chrome DevTools MCP transcripts for any live bug investigated.
- Timestamp of the last fix vs. timestamp of the final full-flow re-run.

## Gate checklist

1. **The core user flow was run to completion on the deployed (not local) URLs.**
   Evidence: walkthrough record referencing the live URL.
2. **Every blocker found was either fixed and re-verified, or explicitly triaged as
   non-blocking.**
   Evidence: bug list with resolution status — nothing left in an unresolved,
   untriaged state.
3. **The full flow was re-run after the last fix, not assumed to still work.**
   Evidence: timestamp of the final re-run, after the last fix's timestamp.

Corresponding Result/DoD (once filled): core flow completes successfully against
deployed URLs; no known blocking bug remains open, non-blocking issues explicitly
logged.

See `agent_doc/README.md` for the verdict scale and reporting format.
