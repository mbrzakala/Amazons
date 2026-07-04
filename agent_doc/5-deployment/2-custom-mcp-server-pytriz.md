---
stage: 5-deployment
step: 2
source: Hackathon Wiki/stages/5-deployment/steps/2-custom-mcp-server-pytriz.md
---

# Validator — 2. Custom MCP Server: pytriz Tool Wrapping

Checks: `Hackathon Wiki/stages/5-deployment/steps/2-custom-mcp-server-pytriz.md`.

## What this step is proving

The product's own MCP server wraps `pytriz` (or the domain equivalent) as a small,
fixed set of named, callable tools backed by one shared store — not a single
do-everything function, and not re-instantiated per request.

## Evidence to gather

- The store/data-layer source (e.g. `app/services/triz.py`), checked for
  single-instance reuse vs. per-request re-instantiation.
- The registered MCP tools (e.g. `app/tools/*.py`), checked for a small named set vs.
  one catch-all function.
- A connected client (Claude, LM Studio, MCP Inspector) listing the server's tools and
  a real call result.

## Gate checklist

1. **The store/data layer wraps the underlying package once and is reused, not
   re-instantiated per request.**
   Evidence: store source code.
2. **The server exposes a small fixed set of named tools (not one giant catch-all
   function).**
   Evidence: tool registration code.
3. **A connected client can list the tools and call at least one successfully against
   the local server.**
   Evidence: client tool-list output + a real (non-stub) call result.

Corresponding Result/DoD (once filled): MCP server runs locally and lists its tools to
a connected client; at least one tool call returns a correct, real result (not a
stub).

See `agent_doc/README.md` for the verdict scale and reporting format.
