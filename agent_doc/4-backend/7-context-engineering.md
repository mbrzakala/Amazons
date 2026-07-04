---
stage: 4-backend
step: 7
source: Hackathon Wiki/stages/4-backend/steps/7-context-engineering.md
---

# Validator — 7. Context Engineering

Checks: `Hackathon Wiki/stages/4-backend/steps/7-context-engineering.md`.

## What this step is proving

The project's coding-agent guidance is split into small, capability-scoped partials
(each naming its trigger keywords and the rules/ratings it maps to) served on demand,
rather than one monolithic system prompt shipped every time — and this actually
resolved a real error at least once.

## Evidence to gather

- Guidance partial files (e.g. `forms.md`, `state-management.md`, `services.md`), each
  checked for frontmatter naming the capability, trigger keywords, and linked
  rules/ratings.
- The retrieval mechanism: an MCP tool, keyword match, or error-text match that selects
  a partial for a given task/error.
- A concrete instance where a build/lint error was mapped to a specific partial and
  handed to a fixer.

## Gate checklist

1. **Guidance is split into more than one capability-scoped file, not one monolithic
   prompt.**
   Evidence: count and scope of partial files.
2. **Each partial's frontmatter names what triggers it and what rule/rating checks
   it.**
   Evidence: frontmatter content per partial.
3. **At least one real error was resolved by serving the matching partial, not the
   whole doc.**
   Evidence: the logged error → partial → fix instance.

Corresponding Result/DoD (once filled): at least 2-3 guidance partials exist with
frontmatter; a retrieval mechanism selects the right partial for a given task/error.

See `agent_doc/README.md` for the verdict scale and reporting format.
