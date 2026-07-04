# Responsive Web Design Strategy

## Breakpoint

Single breakpoint: **767px** (mobile / desktop split).

```
Mobile:   ≤ 767px  →  single-column, drawer nav, reduced padding
Desktop:  ≥ 768px  →  multi-column, fixed sidebar, full padding
```

No tablet intermediate breakpoint. The app is a focused 3-screen workflow tool, not a content site. Two layouts suffice.

## Patterns

### Sidebar → Drawer (shell-level)

| Desktop (≥768px) | Mobile (≤767px) |
|---|---|
| Fixed 260px left sidebar | Hidden, slide-in drawer on toggle |
| Main content `margin-left: var(--sidebar-width)` | Main content `margin-left: 0` |
| No hamburger | Hamburger button in top-nav |
| No backdrop | Semi-transparent backdrop, click to close |

**Implementation:** `app.scss`, `app.html`, `top-nav.component.ts`, `side-nav.component.ts`

### Grid Collapse (component-level)

| Component | Desktop | Mobile |
|---|---|---|
| Pipeline columns grid | 2 columns (`1fr 1fr`) | 1 column |
| Six Hats grid | 2 columns (`1fr 1fr`) | 1 column |
| Problem input context grid | 2 columns (`1fr 1fr`) | 1 column |
| Problem input skeletal grid | 3 columns (`repeat(3, 1fr)`) | 1 column |

**Implementation:** `pipeline-page.scss:43-47`, `six-hats-grid.component.ts:55-59`, `problem-input-page.scss:107-125`

### Header Stack (page-level)

| Page | Desktop | Mobile |
|---|---|---|
| Evaluation page header | Flex row, space-between | Flex column, left-aligned |
| Evaluation bottom actions | Flex row, flex-end | Flex wrap, stretch |
| Problem input action row | Flex row, space-between | Flex column, stretch |

**Implementation:** `evaluation-page.ts:170-199`, `problem-input-page.scss:120-124`

### Table Scroll (data-level)

The evaluation table wrapper uses `overflow-x: auto` at all breakpoints — the table retains its column structure and scrolls horizontally on narrow screens rather than collapsing columns.

**Implementation:** `evaluation-table.ts:52`

### Trail Canvas (diagram-level)

The ng-diagram reasoning trail canvas has fixed `min-height` that reduces on mobile (600px → 400px, 800px → 500px expanded). `overflow-x: auto` allows horizontal panning of the diagram on narrow screens.

**Implementation:** `evaluation-page.ts:191-198`

### Padding Reduction

Page padding reduces from `--space-lg` (24px) / `--space-xl` (48px) to `--space-md` (16px) on mobile to maximize content area.

## What This Strategy Does Not Do

- **No responsive typography.** Font sizes are fixed px in design tokens. The app targets desktop-first use (R&D engineers at workstations). Mobile readability is acceptable at current sizes; fluid type scaling is a future enhancement.
- **No tablet layout.** The 768px+ desktop layout works fine on tablets in landscape. A dedicated tablet breakpoint would add complexity without clear user benefit for this app.
- **No container queries.** Component encapsulation via Angular's emulated shadow DOM means `@media` queries against the viewport are the only mechanism available without restructuring.

## Verification

All responsive rules use the same `@media (max-width: 767px)` breakpoint, ensuring a single, consistent transition point across the entire app. The breakpoint matches the pipeline grid's existing `@media (min-width: 768px)` rule — the two patterns are complementary (mobile-first vs desktop-first) but target the same split.
