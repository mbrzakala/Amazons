---
stage: 5-deployment
task: 2
---

# 2. Custom MCP Server: pytriz Tool Wrapping

**What to do:** Build the product's own custom MCP server by wrapping the `pytriz` package's TRIZ data as callable tools, so any connected chatbot can use it without the method being trained into the model.

**How:**
1. Install `pytriz` and build one shared `TRIZStore` (or your domain's equivalent store) — this holds the actual data (matrix, principles, parameters) plus optional semantic search via an embedding model.
2. Expose a small, fixed set of functions that call the store — matrix/contradiction lookup by ID, semantic search by plain-text description, get-by-ID, get-random — not a single do-everything tool.
3. Register those functions as MCP tools (the layer that lets a chatbot discover and call them) and boot the server on a local port.
4. Verify the running server exposes exactly the tools you registered — connect a client (Claude, LM Studio, or the MCP Inspector) and list tools before wiring it into anything else.

**Recommended tool:** `pytriz` (`pip install pytriz`) wrapped as MCP tools, following the confirmed working shape in `gdg-mcp-workshop`'s `app/services/triz.py` + `app/tools/contradictions.py`. Reference: `stages/5-deployment/gdg-mcp-workshop/MCP Basics.md`, `TRIZ Basics.md`, `How the Server Works.md`, `SIMPLE - how to use.md`.

## Gate

- [ ] The store/data layer wraps the underlying package once and is reused, not re-instantiated per request.
- [ ] The server exposes a small fixed set of named tools (not one giant catch-all function).
- [ ] A connected client can list the tools and call at least one successfully against the local server.

Next: [[3-cloud-build-artifact-registry-cloud-run]].

## Result

**Scope:** Stand up the custom MCP server locally, wrapping the product's domain-logic package (`pytriz` or equivalent) as a small set of named, callable tools.

**DoD:**
- [ ] MCP server runs locally and lists its tools to a connected client.
- [ ] At least one tool call returns a correct, real result (not a stub).

**Layers:** backend: MCP server, tool wrapping.
