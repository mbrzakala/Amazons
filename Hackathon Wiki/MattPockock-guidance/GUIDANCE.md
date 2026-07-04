# Matt Pocock — AI Guidance

[Matt Pocock](https://www.mattpocock.com/) ([@mattpocockuk](https://www.youtube.com/@mattpocockuk)) — creator of Total TypeScript, now runs [AI Hero](https://www.aihero.dev/), teaching AI-assisted engineering for real codebases instead of "vibe coding." Flat index of his tools, skills, and concepts — links only, no copies. Follow the link for the real content.

## Videos — start here

- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko) — complete idea-to-shipped AI coding workflow
- ["Software Fundamentals Matter More Than Ever"](https://www.youtube.com/watch?v=v4F1gFy-hqg) — why engineering fundamentals decide whether AI helps or hurts a codebase
- [Matt Pocock's Agentic Engineering Workflow](https://www.youtube.com/watch?v=nQwJVHCtDDY) — the grill → PRD → issues → AFK agent loop, end to end
- [Sandcastle: Matt Pocock's Secret AI Engine](https://www.youtube.com/watch?v=ZhRWqng7a_8) — running many coding agents in parallel, safely
- [20+ AI Skills That Fix Vibe Coding](https://www.youtube.com/shorts/5IoVDDeuQ8I) — short overview of the skill system below
- [Full channel](https://www.youtube.com/@mattpocockuk) — everything else

## Tools

- [Sandcastle](https://github.com/mattpocock/sandcastle) — `sandcastle.run()` orchestrates sandboxed coding agents (Claude Code, Codex, Cursor, OpenCode, Copilot) in parallel so they don't collide; Docker/Podman/Vercel providers
- [skills](https://github.com/mattpocock/skills) — installable skill pack for Claude Code / Cursor / Codex. Install: `npx skills add mattpocock/skills -y -g`
- [agent-rules-books](https://github.com/mattpocock/agent-rules-books) — AGENTS.md rule sets distilled from Clean Code / Refactoring / DDD / Clean Architecture / DDIA; each rule ships as mini (default), nano (tight context budget), full (reference)
- [AI SDK v6 Crash Course](https://www.aihero.dev/workshops/ai-sdk-v6-crash-course) — free, 57 exercises on Vercel's AI SDK for TypeScript

## Skills (slash commands — installed via the `skills` tool above)

- `/grill-me` — interrogates a plan until every fuzzy term and contradiction is resolved, before code is written
- `/grill-with-docs` — same interrogation, plus writes the shared vocabulary into CONTEXT.md / ADRs
- `/domain-model` — builds/updates the project's domain model
- `/to-prd` — turns a resolved grill conversation into a PRD with user stories
- `/to-issues` — splits a PRD into vertical-slice GitHub issues (schema→API→UI→tests, one thin slice each); tags each HITL or AFK
- `/tdd` — red-green-refactor, one behavior at a time, for agent-written code
- `/handoff` — compacts context so a new agent/session can continue cleanly
- `/prototype` — throwaway code to answer a design question before committing
- `/improve-codebase-architecture` — finds refactors that make code easier for agents to test/change/navigate
- `/triage` — turns a messy backlog into agent-ready issues
- `/review` — checks a diff against both repo standards and the originating spec

## Concepts

- **AFK vs HITL** — AFK: an agent picks up an issue, implements, and merges unattended. HITL: needs a human decision first. Classify every issue as one or the other.
- **Tracer bullet** — a small, real, end-to-end slice (schema→API→UI→tests) shipped and checked before building more; keeps AI output from sprawling into unreviewable "AI slop"
- **Smart zone** — LLMs perform best early in context and degrade after ~100k tokens; scope work to finish inside that window
- **Specs-to-code trap** — writing one huge upfront spec and expecting the agent to nail it in one shot, instead of grilling → PRD → small issues
- **Codebases agents love** — deep modules, clear boundaries, strong types; bad architecture compounds agent errors, good architecture compounds agent output

## Reference

- Site: [mattpocock.com](https://www.mattpocock.com/)
- AI Hero: [aihero.dev](https://www.aihero.dev/) — agent-readable indexes: [llms.txt](https://www.aihero.dev/llms.txt), [skills.md](https://www.aihero.dev/skills.md), [sitemap.md](https://www.aihero.dev/sitemap.md)
- X/Twitter: [@mattpocockuk](https://x.com/mattpocockuk)
