---
stage: 3-frontend-arch
step: 5
source: Hackathon Wiki/stages/3-frontend-arch/steps/5-chrome-devtools-mcp-and-modern-web-guidance.md
---

# Validator — 5. Chrome DevTools MCP & Modern Web Guidance

Checks: `Hackathon Wiki/stages/3-frontend-arch/steps/5-chrome-devtools-mcp-and-modern-web-guidance.md`.

## What this step is proving

Chrome DevTools MCP is connected and was verified with one deliberately-triggered bug
(the agent reported the real error without a manual paste), Modern Web Guidance was
searched before implementing a new UI pattern, and both were set up proactively — not
during an actual mid-hackathon debugging crisis.

## Evidence to gather

- Agent MCP configuration referencing the Chrome DevTools MCP server.
- A recorded test: a deliberately introduced bug (e.g. a removed template binding) and
  the agent's console/network error report, without the error being manually pasted in.
- Terminal history / commit messages referencing `npx modern-web-guidance search` or
  `retrieve`.
- Timestamps: when this setup happened relative to when the team hit real UI bugs.

## Gate checklist

1. **Chrome DevTools MCP is connected and verified with one deliberate bug — the agent
   reported the real console/network error without a manual paste.**
   Evidence: the recorded test transcript.
2. **Modern Web Guidance was searched at least once before a new UI pattern was
   implemented from scratch.**
   Evidence: search invocation preceding the relevant UI code commit.
3. **This was set up now, not deferred until an actual debugging crisis.**
   Evidence: timestamp of setup vs. timestamp of the first real bug encountered. Fail if
   setup only happened reactively, after a crisis.

See `agent_doc/README.md` for the verdict scale and reporting format.
