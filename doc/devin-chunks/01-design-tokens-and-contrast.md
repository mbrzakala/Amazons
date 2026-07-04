# Chunk 01 — Design Tokens & Contrast Audit

## Depends on
Nothing. This is a foundation chunk — run first.

## Context recap
This app's design system (`apps/frontend/design-system/Design-system.md`) is grayscale + one accent, no Tailwind, no Material. Tokens must become plain CSS custom properties in exactly one global stylesheet: `apps/frontend/src/styles.scss` (currently an empty file, already correctly wired once in `project.json`'s `styles` array — do not add a second styles entry anywhere).

Full token values (copy exactly, do not approximate):

**Colors**
```
--color-surface: #f8f9fa;
--color-surface-container-lowest: #ffffff;
--color-surface-container-low: #f3f4f5;
--color-surface-container: #edeeef;
--color-surface-container-high: #e7e8e9;
--color-surface-container-highest: #e1e3e4;
--color-on-background: #191c1d;
--color-on-surface: #191c1d;
--color-on-surface-variant: #45464c;
--color-outline: #76777d;
--color-outline-variant: #c6c6cd;
--color-primary: #111827;        /* "solid black" per written brand copy — use this, not the #000000 in the raw YAML token table */
--color-on-primary: #ffffff;
--color-primary-fixed: #dce2f7;
--color-error: #ba1a1a;
--color-on-error: #ffffff;
--color-error-container: #ffdad6;
--color-accent-recommended: #2563eb;  /* muted blue — ONLY for "Recommended" pathway / "Running" status, nowhere else */
```

**Typography** (font-family, font-size, line-height, font-weight, letter-spacing per name):
```
--font-headline-lg: 600 30px/36px "Geist", sans-serif; letter-spacing: -0.02em;
--font-headline-md: 600 24px/32px "Geist", sans-serif;
--font-title-sm: 500 18px/24px "Geist", sans-serif;
--font-body-md: 400 16px/24px "Geist", sans-serif;
--font-label-mono: 500 13px/16px "JetBrains Mono", monospace; letter-spacing: 0.05em;
--font-label-caps: 700 11px/14px "JetBrains Mono", monospace; letter-spacing: 0.1em; text-transform: uppercase;
```
(CSS custom properties can't hold shorthand `font` values with mixed units cleanly in all browsers — implement as one custom property per sub-value, e.g. `--font-body-md-family`, `--font-body-md-size`, `--font-body-md-line-height`, `--font-body-md-weight`, OR define them as a set of utility classes in the same stylesheet, e.g. `.text-body-md { font-family: var(--font-family-geist); font-size: 16px; line-height: 24px; font-weight: 400; }`. Either approach is fine — pick one and use it consistently for all six type styles.)

**Spacing** (4px base unit):
```
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 48px;
--space-gutter: 16px;
--space-page-margin: 32px;
```

**Radii**:
```
--radius-sm: 0.125rem;
--radius-default: 0.25rem;   /* standard inputs/cards */
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
--radius-full: 9999px;        /* pills, reasoning-trail nodes */
```

**Elevation / border widths** (no shadows anywhere in this app):
```
--border-width-default: 1px;
--border-width-focus: 2px;     /* focus state and Level-2/active cards */
--color-border-default: var(--color-outline-variant);
--color-border-focus: var(--color-primary);
```

## Task
1. Add all custom properties above to a single `:root { ... }` block in `apps/frontend/src/styles.scss`.
2. Add the six typography styles as either custom properties (split per sub-value) or utility classes — your choice, documented with a one-line comment explaining which approach was picked, so later chunks use it consistently.
3. Compute the actual WCAG contrast ratio for each of these pairs (use any standard contrast formula/tool): `on-surface (#191c1d)` on `surface (#f8f9fa)`; `on-surface-variant (#45464c)` on `surface (#f8f9fa)`; `on-primary (#ffffff)` on `primary (#111827)`; `on-error (#ffffff)` on `error (#ba1a1a)`; the accent `#2563eb` as text/icon color on white `#ffffff`.
4. Write the five ratios and pass/fail against WCAG AA (4.5:1 normal text, 3:1 large text/UI components) into a new file `doc/accessibility-contrast-audit.md`. If any pair fails, do not silently adjust the design system's colors — flag it clearly in that file as a known gap with the specific failing pair and ratio, and stop for human review rather than guessing a fix.

## Files to create/modify
- `apps/frontend/src/styles.scss` (add `:root` block + typography styles/classes)
- `doc/accessibility-contrast-audit.md` (new)

## Out of scope
- Do not touch `index.html`, fonts, or any component file — that's chunk 02+.
- Do not build any Angular component in this chunk.

## Definition of done
- [ ] `apps/frontend/src/styles.scss` contains every custom property listed above under `:root`, with the exact hex/px/em values given (except `--color-primary`, which is deliberately `#111827`, not the `#000000` from the raw token YAML).
- [ ] `project.json`'s `styles` array still lists this one file only — confirm no second stylesheet was added.
- [ ] `doc/accessibility-contrast-audit.md` exists with all five computed ratios and a pass/fail verdict for each.

## Handoff
Every later chunk styles components using `var(--color-...)`, `var(--space-...)`, `var(--radius-...)` and the typography approach chosen here — never hardcoded hex/px values. If a contrast pair failed, the next chunk to touch that color must address the logged gap before treating it as final.
