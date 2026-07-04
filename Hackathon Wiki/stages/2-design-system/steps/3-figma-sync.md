---
stage: 2-design-system
task: 3
---

# 3. Stitch Project as the Source of Truth

**What to do:** Keep working in one persistent Stitch project instead of regenerating from scratch each time, so it stays the one inspectable place both humans and the MCP connection (step 5) reference.

**How:**
1. Reuse the same Stitch project across iterations — add to it, don't start a fresh generation, so tokens and components stay consistent as the product grows.
2. Treat that Stitch project as what the team checks when asking "what does the design system currently say" — the role a synced Figma file would otherwise play.
3. If the product later needs design-system governance Stitch doesn't yet cover as well — many-screen consistency at scale, formal design-to-dev handoff, a structured component library — Figma remains available as an optional add-on. Don't add it by default; only reach for it if the team hits a real, named gap. If a teammate simply hands you an existing Figma file to read from, step 5 has the concrete, simplest-first recipe for that — it doesn't require building anything in Figma yourself.

**Recommended tool:** The team's own Stitch project, kept as one continuous canvas. Backup: Figma, only if Stitch's design-system coverage genuinely falls short at scale — import Stitch's exported tokens/components into a Figma file the same way this step originally would have synced a hand-built system.

## Gate

- [ ] The team is iterating on one Stitch project, not regenerating from a blank canvas each time.
- [ ] Everyone knows this project is the current source of truth for the design system.
- [ ] Figma was not added unless a specific, named gap in Stitch's coverage was actually hit.

Next: [[4-design-tokens-component-anatomy]].

## Superseded

**2026-07-04:** Design handoff changed from Figma-first to Stitch-first (see `PRODUCT.md` → Stack). This step originally had the team sync a hand-built or Antigravity-generated system into a new Figma file so it had one visual source of truth. Google Stitch now generates the system, exports directly to Angular, and ships its own MCP server — so the "one inspectable source of truth" role is filled by the Stitch project itself, with Figma reduced to an optional fallback for design-system governance at scale. Reason: faster to a working UI, no separate hand-off step, and Stitch exports Angular code natively.

## Result
