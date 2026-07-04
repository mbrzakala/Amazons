---
stage: 2-design-system
task: 1
---

# 1. Accessibility Checklist

**What to do:** Run a short accessibility checklist before setting any design tokens, so accessibility is baked in rather than retrofitted later.

**How:**
1. Check text-to-background contrast is ≥ 4.5:1 for body text (test your primary color on its background).
2. Confirm every interactive element (buttons, inputs, links) is reachable by Tab key alone — no click-only custom widgets.
3. Add an `aria-label` to every icon-only button (no visible text label).
4. Make sure form errors are announced with text, not color alone (e.g. red border **and** an inline message like "Amount is required").

**Recommended tool:** Browser DevTools' built-in Lighthouse accessibility audit (free, no install). Backup: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) for manual color-pair checks; Chrome DevTools MCP (from Day 3) to have the AI agent audit contrast/labels directly on a running app.

## Gate

- [ ] Contrast, keyboard reachability, icon-button labels, and error-announcement are all checked at least once.
- [ ] Any failing item is fixed or explicitly logged as a known gap, not silently skipped.
- [ ] The check happened **before** design tokens were finalized, not after.

Next: [[2-design-system-generation]].

## Result
