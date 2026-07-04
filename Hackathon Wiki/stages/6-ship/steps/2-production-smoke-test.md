---
stage: 6-ship
task: 2
---

# 2. Production Smoke Test

**What to do:** Run the product's core user flow against the deployed URLs (not localhost) and fix anything that blocks it before touching anything else.

**How:**
1. Walk through the core flow end to end on the live deployed frontend URL — the smallest path that proves the product works, same idea as the MVP scope from stage 1.
2. If something breaks, use Chrome DevTools MCP against the live URL to inspect the real console/network error rather than guessing.
3. Triage by the lead-domino principle: fix whatever blocks the core flow first; cosmetic issues and edge cases wait.
4. Re-run the full core flow after each fix — a fix for one thing can break another this close to deadline.

**Recommended tool:** Manual walkthrough on the deployed frontend URL, plus Chrome DevTools MCP for any live bug. Backup: Antigravity's Browser Subagent for a rendering/layout issue that needs visual confirmation.

## Gate

- [ ] The core user flow was run to completion on the deployed (not local) URLs.
- [ ] Every blocker found was either fixed and re-verified, or explicitly triaged as non-blocking.
- [ ] The full flow was re-run after the last fix, not assumed to still work.

Next: [[3-demo-script-and-pitch]].

## Result

**Scope:** Verify the deployed product's core flow works end-to-end in production and close out any blocking bugs found.

**DoD:**
- [ ] Core flow completes successfully against deployed URLs.
- [ ] No known blocking bug remains open; non-blocking issues are explicitly logged, not silently ignored.

**Layers:** full stack: whatever the core flow touches (frontend, backend, MCP server, DB).
