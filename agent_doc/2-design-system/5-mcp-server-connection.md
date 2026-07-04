---
stage: 2-design-system
step: 5
source: Hackathon Wiki/stages/2-design-system/steps/5-mcp-server-connection.md
---

# Validator — 5. MCP Server Connection

Checks: `Hackathon Wiki/stages/2-design-system/steps/5-mcp-server-connection.md`.

## What this step is proving

The coding agent queries the live design system directly through Stitch's own MCP
server (verified with a real test request), instead of the team re-explaining the
design system in every prompt. If a Figma file had to be read instead, the simplest
working tier was used, not the most automated one by default.

## Evidence to gather

- The agent's MCP server configuration (Devin IDE / Claude config referencing Stitch's
  MCP server).
- A concrete test-request transcript or commit: an agent-generated Angular component
  whose anatomy matches the step-4 documented anatomy, generated without the prompt
  re-stating variants/states.
- If a Figma file was read instead: which of the three tiers (copy-paste, personal
  access token + REST, official remote MCP) was actually used, and why.

## Gate checklist

1. **Stitch's MCP server is connected and pointed at the team's actual Stitch
   project.**
   Evidence: MCP config referencing the correct project.
2. **One test request through the connection returns a component matching the
   documented anatomy, without re-typing the variants/states in the prompt.**
   Evidence: the test transcript/commit and the step-4 anatomy doc, compared side by
   side.
3. **The connection is treated as trusted after verification** — not re-explained from
   scratch each session.
   Evidence: later prompts/commits don't re-paste the full design system description.
4. **If an existing Figma file needed to be read, the simplest option that actually
   worked was used, not the most automated one by default.**
   Evidence: team note on which tier was used and why. N/A if no Figma file was ever
   involved.

See `agent_doc/README.md` for the verdict scale and reporting format.
