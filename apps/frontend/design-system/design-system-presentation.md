# Design System Presentation — Hackathon Pitch

> 5-minute walkthrough. Present from this doc + live demo at `http://localhost:4200`.

---

## Slide 1: Design System — Skeletal Minimalism

**Concept:** A digital lab notebook for R&D reasoning. Analytical, transparent, precise.

**Key decisions:**
- Grayscale palette + one accent color (blue, reserved for "Recommended" only)
- Geist (sans) for content, JetBrains Mono for meta-information (IDs, status, provenance)
- No shadows — depth via tonal layers and stroke weights
- Sharp/squared shapes (4px radius) — engineering aesthetic
- X-box placeholders for loading states — wireframe-first mentality

**Evidence:** `Design-system.md` spec, 3 wireframe screenshots in `ui-frames/`

---

## Slide 2: Tokenization & Implementation

**Single source of truth:** `styles.scss:10-105` — 95 lines of CSS custom properties.

**Token categories:**
- Color: 20+ tokens (grayscale ramp + primary + accent + error)
- Typography: 6 font tokens (headline-lg, headline-md, title-sm, body-md, label-mono, label-caps)
- Spacing: 7 tokens (4px base unit — xs/sm/md/lg/xl/gutter/margin-page)
- Radii: 6 tokens (sm/default/md/lg/xl/full)
- Borders: 4 tokens + aliases (border-1, border-2-primary)

**Compliance proof:**
- Grep for hex literals in component styles: **zero matches** outside `styles.scss`
- `.card-surface` global utility class — shared border + background across 5 card components
- `rd-card-anatomy.md` — component-level token usage map

**Live demo:** Open DevTools → Elements → show `:root` custom properties, then inspect any component to show `var(--...)` consumption.

---

## Slide 3: Accessibility

**WCAG 2.1 contrast audit** (`accessibility-audit.md`):
- 13 text/background pairings verified
- All pass AA (4.5:1); most pass AAA (7:1)
- 3 failures found and fixed (pending chip, done phase text, upcoming phase text)

**Keyboard & screen reader:**
- All interactive elements are native `<a>`/`<button>` — Tab-reachable
- `:focus-visible` on all shell and page components (2px primary outline)
- `aria-label` on all icon-only buttons
- `aria-hidden="true"` on all decorative icons
- `aria-live="polite"` on error region with `role="status"`
- `ariaCurrentWhenActive="page"` on all nav links (active route reporting)
- `role="alertdialog"` + `aria-modal="true"` on confirm dialog

**Non-text contrast note:** Default borders (#c6c6cd) at 1.61:1 are below 3:1 WCAG 1.4.11, but are supplementary to background fill + spacing. Interactive elements switch to 2px primary (#111827, 16.33:1) on focus — exceeds requirement.

---

## Slide 4: Responsive Web Design

**Single breakpoint: 767px** (mobile / desktop split).

**Mobile patterns:**
- Sidebar → slide-in drawer with hamburger toggle + backdrop
- All multi-column grids → single column
- Page padding reduced (24px/48px → 16px)
- Evaluation table → horizontal scroll wrapper
- Trail canvas → reduced min-height + horizontal scroll
- Headers and action rows → vertical stack

**What we don't do (and why):**
- No responsive typography — app targets desktop-first R&D engineers
- No tablet breakpoint — desktop layout works in tablet landscape
- No container queries — Angular's emulated shadow DOM limits to viewport queries

**Evidence:** `rwd-strategy.md`, live demo resize

---

## Slide 5: Cohesion with App Objective

**The app:** TRIZ + Six Hats reasoning → evaluation → full reasoning trail. Every step must be "a real, inspectable piece of logic."

**The design system serves this because:**

| Design choice | App objective served |
|---|---|
| Skeletal Minimalism | Nothing decorative hides the logic structure |
| No shadows | Process steps visible at actual depth |
| One accent color | "Recommended" selection is visually unmistakable |
| Monospace meta-info | Audit trail character — steps are traceable |
| Status chips | Async generation is visible — "real, inspectable logic" |
| 3-screen workflow | Maps 1:1 to: problem → contradiction → candidates → evaluation → choice |
| Orthogonal trail connectors | Schematic aesthetic matches engineering reasoning |
| Token discipline | Consistency enforced at build level, not by convention |

**Evidence:** `design-cohesion-narrative.md`, live demo walkthrough of all 3 screens

---

## Live Demo Script (2 minutes)

1. **Screen A** (`/`): Show problem input form, focus state on textarea (border 1px → 2px), submit → skeletal grid appears
2. **Screen B** (`/pipeline`): Two method columns, TRIZ reformulation card, Six Hats grid, solution cards transitioning running → done, status chips
3. **Screen C** (`/evaluation`): Evaluation table with recommended row highlighted (accent blue), reasoning trail diagram with orthogonal connectors, click a node → detail panel, node detail in card-surface container
4. **Resize to mobile:** Sidebar collapses, hamburger appears, grids stack to 1 column
5. **DevTools:** Show `:root` tokens, inspect a card → `var(--...)` everywhere, no hardcoded hex
