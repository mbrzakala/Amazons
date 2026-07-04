# Chunk 02 — Fonts & Base Typography

## Depends on
Chunk 01 (`apps/frontend/src/styles.scss` must already have the `:root` token block and the typography approach — custom properties or utility classes — decided there).

## Context recap
Two font families are required everywhere in this app: **Geist** (all primary UI/body copy) and **JetBrains Mono** (all "meta" info: status chips, table headers, IDs, labels). No CDN Tailwind font bundle — load fonts directly (Google Fonts `<link>` is fine, or self-hosted if you prefer, your call, but pick one and don't mix).

## Task
1. In `apps/frontend/src/index.html`, add font loading for Geist (weights 400/500/600/700) and JetBrains Mono (weights 400/500/700) — either a Google Fonts `<link>` tag or a self-hosted `@font-face` block in `styles.scss`.
2. In `apps/frontend/src/styles.scss`, set `html, body { margin: 0; background: var(--color-surface); color: var(--color-on-surface); }` and apply the `body-md` typography style (from chunk 01) as the default body font.
3. Verify by running `npx nx serve frontend` and confirming in the browser's computed styles panel that body text actually renders in Geist (not a fallback sans-serif) and that JetBrains Mono is available (test by temporarily applying `.text-label-mono` — or your equivalent class — to any visible text node and confirming the monospace font renders, then remove the test).

## Files to create/modify
- `apps/frontend/src/index.html`
- `apps/frontend/src/styles.scss`

## Out of scope
- Do not build any feature component here.
- Do not change routing or `app.routes.ts`.

## Definition of done
- [ ] Both font families load and render correctly, verified in a live browser (not just "should work").
- [ ] `body` defaults to the `body-md` style from chunk 01's tokens.

## Handoff
Every component built from here on can assume Geist and JetBrains Mono are already available globally — never add a per-component font import.
