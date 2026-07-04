---
stage: 2-design-system
step: 4
source: Hackathon Wiki/stages/2-design-system/steps/4-design-tokens-component-anatomy.md
---

# Validator — 4. Design Tokens & Component Anatomy

Checks: `Hackathon Wiki/stages/2-design-system/steps/4-design-tokens-component-anatomy.md`.

## What this step is proving

Every token in use is documented once, one component's full anatomy is written down,
and tokens are embedded as CSS custom properties in exactly one global stylesheet
registered once in the Angular build — the app's equivalent of a single
`tailwind.config.ts`.

## Evidence to gather

- A token list file (`name: value` pairs) — dedicated doc, or the stylesheet itself.
- The documented anatomy (variants/states/parts) for at least one component.
- The global stylesheet (e.g. `src/styles.scss`) and its `:root` custom-property block.
- `angular.json`'s `styles` array, to confirm the stylesheet is referenced exactly
  once.
- Component source files, grepped for hardcoded hex/px values vs. `var(--token-name)`.
- If Angular Material and/or Tailwind are in use: the Material theme config
  (`use-system-variables`) and/or `tailwind.config.ts`'s `theme.extend`.

## Gate checklist

1. **Every token used so far is listed with its value in one file.**
   Evidence: token list vs. actual `var(--...)` usages in code. Fail if tokens are used
   in code but not listed, or listed in more than one competing file.
2. **At least one component's variants, states, and parts are fully documented.**
   Evidence: the anatomy doc. Fail if it's missing any of the three categories.
3. **Tokens are embedded as CSS custom properties in exactly one global stylesheet,
   registered once in the Angular build config — not redeclared per component.**
   Evidence: `styles.scss` + `angular.json`. Fail if tokens are redeclared in
   component-level stylesheets, or the global stylesheet is referenced more than once.
4. **If Material and/or Tailwind are in play, both resolve to the same custom
   properties rather than keeping separate token values.**
   Evidence: Material theme config / Tailwind config. Fail if either has its own
   hardcoded values instead of pointing at the shared custom properties. N/A if neither
   library is in use — mark UNKNOWN only if it's unclear whether they're in use at all.

See `agent_doc/README.md` for the verdict scale and reporting format.
