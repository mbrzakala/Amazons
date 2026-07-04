---
stage: 2-design-system
task: 2
---

# 2. Design System Generation

**What to do:** Generate a first-pass design system (color palette, spacing scale, type scale, base components) from a brief, using Google Stitch instead of hand-building it in Figma.

**How:**
1. Write one paragraph describing product tone (e.g. "clean, trustworthy, fintech-adjacent, minimal"), or describe the app's flow directly — Stitch can generate up to 5 connected screens from a described flow in one pass.
2. Generate the system in Stitch: color tokens, a spacing scale, a type scale, and 1-2 base components (e.g. Button, Card), previewed live on its canvas.
3. Export straight to Angular code from Stitch (Angular is one of its supported code-export targets) — this replaces a separate Figma hand-off.
4. Stop after at most two iterations — diminishing returns kick in fast.

**Recommended tool:** Google Stitch (Google Labs) — generates the UI and exports directly to Angular code, with its own MCP server for handing designs to a coding agent (see step 5). Backup: Antigravity's Browser Subagent to visually re-verify the exported Angular code actually renders correctly once it's in the app (Stitch's canvas preview shows the design, not proof the exported code compiles and runs); Claude directly, verifying the render yourself, if neither tool is available.

## Gate

- [ ] One tone/flow description exists before generation starts.
- [ ] Output includes color tokens, a spacing scale, a type scale, and at least one base component.
- [ ] Generation was not iterated more than twice.
- [ ] The exported Angular code was verified to actually render (screenshot or live render), not assumed from the Stitch canvas preview alone.

Next: [[3-figma-sync]].

## Result
