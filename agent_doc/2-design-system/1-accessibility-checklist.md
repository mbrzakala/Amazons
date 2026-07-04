---
stage: 2-design-system
step: 1
source: Hackathon Wiki/stages/2-design-system/steps/1-accessibility-checklist.md
---

# Validator — 1. Accessibility Checklist

Checks: `Hackathon Wiki/stages/2-design-system/steps/1-accessibility-checklist.md`.

## What this step is proving

Contrast, keyboard reachability, icon-button labeling, and error-announcement were
checked *before* design tokens were finalized — accessibility baked in, not retrofitted.

## Evidence to gather

- A Lighthouse accessibility audit result (screenshot/report), or WebAIM Contrast
  Checker results, or a Chrome DevTools MCP audit transcript.
- Timestamps/commit order: when this check happened vs. when design tokens (step 4)
  were finalized.
- Any logged known-gap notes for failing items.

## Gate checklist

1. **Contrast, keyboard reachability, icon-button labels, and error-announcement are
   all checked at least once.**
   Evidence: audit report or manual check notes covering all four. Fail if any of the
   four is missing.
2. **Any failing item is fixed or explicitly logged as a known gap, not silently
   skipped.**
   Evidence: audit report plus either a fix commit or a written known-gap note. Fail if
   a failing item has neither.
3. **The check happened before design tokens were finalized, not after.**
   Evidence: compare this check's timestamp/commit against step 4's token-finalization
   commit. Fail if tokens were finalized first.

See `agent_doc/README.md` for the verdict scale and reporting format.
