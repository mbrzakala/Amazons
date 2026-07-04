---
stage: 2-design-system
task: 4
---

# 4. Design Tokens & Component Anatomy

**What to do:** Write down the token list and one component's full anatomy once, and embed the tokens into Angular globally in one place — the Angular equivalent of a `tailwind.config.ts` for the whole app.

**How:**
1. List every token in use so far as `name: value` pairs (e.g. `color.primary: #1A73E8`, `space.md: 16px`).
2. Pick one component (e.g. Button) and document its variants (primary/secondary/danger), states (default/hover/disabled), and parts (label, optional icon slot).
3. Embed the tokens globally: declare every token as a CSS custom property under `:root` in **one** global stylesheet (e.g. `src/styles.scss`), and reference that single file once in the app's build config (`angular.json` → the app's `styles` array). Every component then reads `var(--token-name)` directly — no per-component import needed, since Angular injects global styles once for the whole app. This one file is the direct equivalent of `tailwind.config.ts`: one place, global effect.
4. If the team is also using Angular Material, enable `use-system-variables: true` on the Material theme so Material's own component tokens resolve to the *same* CSS custom properties instead of a second, parallel token system. If the team layers Tailwind CSS on top, point `tailwind.config.ts`'s `theme.extend` at these same custom properties (e.g. `colors: { primary: 'var(--color-primary)' }`) instead of duplicating raw hex/px values — one source of truth either way.

**Recommended tool:** A single global `styles.scss` (referenced once in `angular.json`) holding every token as a CSS custom property — the simplest option, and correct regardless of whether Material or Tailwind gets added later. Backup: Angular Material's M3 theming API with `use-system-variables: true`, if the team is already on Material; a plain markdown/JSON token file (`design-tokens.md`/`tokens.json`) as the documentation source if no styling library is wired up yet.

## Gate

- [ ] Every token used so far is listed with its value in one file.
- [ ] At least one component's variants, states, and parts are fully documented.
- [ ] Tokens are embedded as CSS custom properties in exactly one global stylesheet, registered once in the Angular build config — not redeclared per component.
- [ ] If Material and/or Tailwind are in play, both resolve to the same custom properties rather than keeping separate token values.

Next: [[5-mcp-server-connection]].

## Result
