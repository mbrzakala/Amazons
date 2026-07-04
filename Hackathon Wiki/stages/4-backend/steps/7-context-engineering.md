---
stage: 4-backend
task: 7
---

# 7. Context Engineering

**What to do:** Split one large system prompt into small, capability-scoped guidance partials served on demand, instead of shipping the whole manual on every generation.

**How:**
1. Take the project's system instructions and break them into one markdown partial per capability (e.g. `forms.md`, `state-management.md`, `services.md`) — each with frontmatter naming the capability, the keywords that trigger it, and which lint rules/ratings enforce or score it.
2. Serve only the partials a given task actually needs (via an MCP tool or a keyword/error match), not the entire guidance doc every time.
3. When a build or lint error occurs, map the error text to the specific partial that explains it (e.g. a `formField`/signal-forms error → serve `forms.md`) and hand the fixer that one partial plus the failing file — not the whole project history.

**Recommended tool:** Write directly, following the confirmed pattern in `wcs-edd/wiki/` (one partial per capability, frontmatter-linked to rules/ratings) and the error-to-partial matching in `wcs-edd/agents/workflow-gated-agent.runner.mjs`.

## Gate

- [ ] Guidance is split into more than one capability-scoped file, not one monolithic prompt.
- [ ] Each partial's frontmatter names what triggers it and what rule/rating checks it.
- [ ] At least one real error was resolved by serving the matching partial, not the whole doc.

Next: [[8-multi-agent-systems]].

## Result

**Scope:** Decompose the project's coding-agent guidance into capability-scoped partials that get served on demand instead of one always-on prompt.

**DoD:**
- [ ] At least 2-3 guidance partials exist, each scoped to one capability with frontmatter (trigger keywords, linked rules).
- [ ] A retrieval mechanism (MCP tool, keyword match, or error-text match) selects the right partial for a given task/error.

**Layers:** tooling: agent context/prompt structure.
