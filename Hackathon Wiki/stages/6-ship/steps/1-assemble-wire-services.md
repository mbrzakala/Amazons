---
stage: 6-ship
task: 1
---

# 1. Assemble: Wire Every Deployed Service Together

**What to do:** Point each deployed service's configuration at the other services' real Cloud Run URLs — the first time everything talks to the live version of everything else, not localhost.

**How:**
1. Take the real Cloud Run URLs from stage 5 (MCP server, backend, frontend).
2. Update the frontend's runtime config to point at the deployed backend URL (e.g. via its Settings/config screen or config file), not `localhost`.
3. Update the backend's env vars to point at the deployed MCP server (and any agent layer in between) URL, not `localhost`.
4. Redeploy any service whose config changed, and confirm the chain frontend → backend → MCP server is using only real URLs end to end.

**Recommended tool:** Write directly — update each service's config/env vars and redeploy via the same `gcloud run deploy --set-env-vars=...` pattern used in stage 5. Reference: `stages/5-deployment/gdg-mcp-workshop/GCP Deploy Windows 11.md` ("Show All URLs" section) for how to pull every service's real URL in one place.

## Gate

- [ ] Every service's config points at another *deployed* URL where a connection is needed — no `localhost` references remain in production config.
- [ ] The full chain (frontend → backend → MCP server) was exercised at least once after rewiring.
- [ ] Any service that needed a redeploy after a config change was actually redeployed.

Next: [[2-production-smoke-test]].

## Result

**Scope:** Rewire every deployed service to reference the others' real Cloud Run URLs, assembling the separately-built pieces into one live product.

**DoD:**
- [ ] No production config references `localhost` for an inter-service call.
- [ ] Frontend → backend → MCP server chain works end-to-end against deployed URLs.

**Layers:** infra: service configuration, env vars across frontend/backend/MCP server.
