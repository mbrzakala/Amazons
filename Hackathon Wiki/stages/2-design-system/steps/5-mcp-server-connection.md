---
stage: 2-design-system
task: 5
---

# 5. MCP Server Connection

**What to do:** Connect Stitch's own MCP server to the team's coding agent so it queries the live design system directly, instead of guessing from a screenshot or hand-copying exported files.

**How:**
1. Set up Stitch's MCP server (ships with Stitch; connects directly to Claude Code, Cursor, Gemini CLI, and similar coding agents).
2. Connect it into Devin IDE (primary build tool) or Claude.
3. Verify with one test request: ask the connected agent to fetch a component's anatomy from the Stitch project (step 3) and generate matching Angular code, referencing the global tokens from step 4.
4. Once verified, trust the connection — don't manually re-explain the design system in every prompt afterward.
5. Only if a teammate or existing asset hands you a Figma file instead of a Stitch project: use the simplest of the three read options below that actually works — don't reach for the most automated one out of habit.

**Recommended tool:** Stitch's built-in MCP server, connected into Devin IDE or Claude.

Reading an existing Figma file directly (simplest first — Figma stays optional per step 3; this is only for when one already exists and you have zero time to build anything in it):
1. **Copy-paste, zero setup, always works:** open the file in Dev Mode, select the frame/layer, copy its code snippet from the Inspect panel, and separately copy/export it as a PNG. Paste both into the agent's chat and ask it to convert to an Angular component using the step 4 tokens by name — not hardcoded values.
2. **Personal access token + REST API, ~2 min setup, no MCP or plugin needed:** Figma → Settings → Security → Personal access tokens → generate one scoped to `file_content:read`. The agent (or a one-line script) then fetches the file's JSON directly: `GET api.figma.com/v1/files/<file-key>`, header `X-Figma-Token: <token>`.
3. **Figma's official remote MCP server, most automated, needs an actual connection to read live:** add `https://mcp.figma.com/mcp` as a remote MCP server (Claude Code: `claude plugin install figma@claude-plugins-official`; other clients: see the [Figma MCP Catalog](https://www.figma.com/mcp-catalog/)). Ask the agent to use its `get_design_context` / `get_variable_defs` / `get_screenshot` tools on a specific frame — no manual copying at all. Confirm the team's actual Figma seat supports this before relying on it under time pressure; option 2 works regardless of seat type.

Whichever tier gets used, the output still goes through the same step 4 discipline: new values become CSS custom properties in the one global stylesheet, never hardcoded per component.

## Gate

- [ ] Stitch's MCP server is connected and pointed at the team's actual Stitch project.
- [ ] One test request through the connection returns a component matching the documented anatomy, without re-typing the variants/states in the prompt.
- [ ] The connection is treated as trusted after verification — not re-explained from scratch each session.
- [ ] If an existing Figma file needed to be read, the simplest option that actually worked was used, not the most automated one by default.

Next: [[6-ai-agent-component-generation]].

## Result
