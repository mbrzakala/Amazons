---
stage: 3-frontend-arch
task: 5
---

# 5. Chrome DevTools MCP & Modern Web Guidance

**What to do:** Connect Chrome DevTools MCP so the coding agent can inspect the browser's live state directly, and use Modern Web Guidance before implementing any new UI pattern — set both up now, not mid-crisis at hour 30.

**How:**
1. Connect the Chrome DevTools MCP server to the primary agent (Devin IDE / Claude). On Windows this means launching Chrome with `--remote-debugging-port=9222` after killing any running Chrome processes — see `best-practices/browser-live-connection.md` for the full connection reference (sandboxed / auto-connect / manual-port / slim modes) and `bug-museum-participants-view/CHROME-DEVTOOLS-MCP-REFERENCE.md` for the exact Windows 11 / Chrome 149 steps and troubleshooting table.
2. Verify the connection by deliberately triggering a bug (e.g. remove a template binding that supplies a required signal input) and asking the agent to check the console/network tab and fix it — it should report the exact error without you pasting it manually.
3. Before implementing any new HTML/CSS/client-side JS pattern (modals, animations, forms, layout), search Modern Web Guidance first: `npx modern-web-guidance search "<what you're building>"`, then `npx modern-web-guidance retrieve "<id>"` for the full guide. This steers away from legacy patterns baked into training data.

**Recommended tool:** Chrome DevTools MCP server connected into Devin IDE, plus the `modern-web-guidance` CLI/skill. Backup: Antigravity's Browser Subagent (can reproduce and visually verify a fix in one autonomous loop, useful for rendering/layout bugs); manually opening DevTools and pasting console errors into Claude chat if the MCP connection isn't available.

## Gate

- [ ] Chrome DevTools MCP is connected and verified with one deliberate bug — the agent reported the real console/network error without a manual paste.
- [ ] Modern Web Guidance was searched at least once before a new UI pattern was implemented from scratch.
- [ ] This was set up now, not deferred until an actual debugging crisis.

Last task — once it passes, the stage is done.

## Result
