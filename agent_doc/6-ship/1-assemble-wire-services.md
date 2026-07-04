---
stage: 6-ship
step: 1
source: Hackathon Wiki/stages/6-ship/steps/1-assemble-wire-services.md
---

# Validator — 1. Assemble: Wire Every Deployed Service Together

Checks: `Hackathon Wiki/stages/6-ship/steps/1-assemble-wire-services.md`.

## What this step is proving

Every deployed service's config now points at the other services' real Cloud Run URLs
— no `localhost` left in production config — and the full frontend → backend → MCP
server chain was actually exercised end-to-end after rewiring.

## Evidence to gather

- Each service's deployed env vars/config, grepped for `localhost` references.
- A live end-to-end request through the full chain (frontend UI action → backend →
  MCP server) against deployed URLs.
- Deploy history/timestamps for any service whose config changed, confirming it was
  actually redeployed afterward.

## Gate checklist

1. **Every service's config points at another deployed URL where a connection is
   needed — no `localhost` references remain in production config.**
   Evidence: deployed config/env var grep.
2. **The full chain (frontend → backend → MCP server) was exercised at least once after
   rewiring.**
   Evidence: a live end-to-end test result.
3. **Any service that needed a redeploy after a config change was actually
   redeployed.**
   Evidence: deploy timestamps vs. config-change timestamps.

Corresponding Result/DoD (once filled): no production config references `localhost`
for an inter-service call; frontend → backend → MCP server chain works end-to-end
against deployed URLs.

See `agent_doc/README.md` for the verdict scale and reporting format.
