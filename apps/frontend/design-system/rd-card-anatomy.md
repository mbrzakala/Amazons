# R&D Card — Component Anatomy

Satisfies: `agent_doc/2-design-system/4-design-tokens-component-anatomy.md`

## Overview

The R&D Card is the primary container component in the system, recurring on Screens A (Problem Input) and B (Solution Pipeline). It provides a ruled-header, bordered-body container with two variants and three states. The component is implemented as `app-rd-card` in `shared/ui/rd-card.component.ts`.

## Selector

```
app-rd-card
```

## Inputs (signal-based)

| Input | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `false` | When true, switches the border from 1px outline-variant to 2px solid primary. |

## Content Projection

Two `<ng-content>` slots:
- `[card-header]` — optional header slot, rendered above the body with a bottom border
- Default `<ng-content />` — body content, padded with `--space-lg`

## Parts

### 1. Card (root container)

```
+-------------------------------------------+
|  HEADER (optional, ruled)                 |
|  +-----------------------+--------------+ |
|  | Title (title-sm)      | Subtitle     | |
|  | font-weight: 700      | (label-mono) | |
|  +-----------------------+--------------+ |
+-------------------------------------------+
|  BODY (projected content)                 |
|  padding: --space-lg (24px)               |
|                                           |
|  <ng-content />                           |
|                                           |
+-------------------------------------------+
```

| Part | Token | Value |
|---|---|---|
| Background | `--color-surface-container-lowest` | `#ffffff` (via `.card-surface` global class) |
| Border (default) | `--border-1` | `1px solid #c6c6cd` (via `.card-surface` global class) |
| Border (active) | `--border-2-primary` | `2px solid #111827` |
| Radius | `--radius-default` | `0.25rem` |

### 2. Header

Only rendered when content is projected into the `[card-header]` slot.

| Part | Token | Value |
|---|---|---|
| Padding | `--space-md` `--space-lg` | `16px 24px` |
| Bottom border | `--border-1` | `1px solid #c6c6cd` |
| Layout | flex, space-between, center | — |
| Gap | `--space-md` | `16px` |

Header content is fully consumer-driven via `<ng-content select="[card-header]" />`. The component applies layout and border styling; the consumer provides the heading element and any accompanying elements.

### 3. Body

| Part | Token | Value |
|---|---|---|
| Padding | `--space-lg` | `24px` |

## Variants

### Default

Standard 1px border, white background. Used for static informational cards (Screen A problem input card, Screen B reformulation cards).

### Active

Triggered by `active()=true`. Replaces border with `2px solid --color-primary`. Used when a card is selected, focused, or represents the current step in a workflow. No background change — the border weight alone communicates emphasis, consistent with the "no shadows" elevation rule.

## States

### Default (rest)

- Border: `1px solid --color-outline-variant`
- Background: `--color-surface-container-lowest`
- No shadow (elevation rule: no shadows anywhere)

### Active

- Border: `2px solid --color-primary`
- Background: `--color-surface-container-lowest` (unchanged)
- No shadow

### Hover (not on rd-card itself, but on derivative card components)

The base `app-rd-card` does not have a hover state. Derivative card components (e.g., `solution-card.component.ts`) add hover behavior:
- Border color shifts to `--color-primary`
- Arrow icon translates 4px right
- Transition: `border 0.2s`

This is an extension pattern, not a base feature.

## Token Usage Map

All tokens consumed by this component:

```
--color-surface-container-lowest   card background (via .card-surface)
--color-outline-variant            default border (via .card-surface)
--color-primary                    active border
--space-md                         header vertical padding, header gap
--space-lg                         header horizontal padding, body padding
--radius-default                   card corner radius
```

No hardcoded hex or px values. All values reference CSS custom properties from `styles.scss`.

The `.card-surface` global utility class (defined in `styles.scss`) provides the shared `border` and `background` ruleset, ensuring single-source-of-truth for all card-like containers across the app.

## Accessibility

- **Heading hierarchy**: The card does not render its own heading. Consumers project headings via the `[card-header]` slot. Must be placed in a context where `<h1>` (page heading) and `<h2>`/`<h3>` (section headings) exist above any projected `<h4>`.
- **Contrast**: Background and border tokens pass WCAG AA for non-text UI component boundaries. Active border (2px solid #111827) at 16.33:1 exceeds 3:1 threshold.
- **Keyboard**: Card itself is not focusable (it's a container, not interactive). Interactive elements projected into the body must provide their own focus indicators.
- **Screen reader**: Header + body structure is semantic. No ARIA attributes needed on the card itself.

## Derivative Components

The R&D Card pattern is extended by:

| Component | File | Differences |
|---|---|---|
| Solution Card | `features/pipeline/solution-card.component.ts` | Adds status chip, hover state, progress bar (running), provenance footer, 2-line description clamp. Padding is `--space-md` (16px) instead of `--space-lg`. Uses `.card-surface` class. |
| Reformulation Card | `features/pipeline/triz-reformulation-card.component.ts` | Uses `.card-surface` class with custom field layout for TRIZ parameters. |
| Hat Card | `features/pipeline/six-hats-grid.component.ts` | Mini-card variant: smaller padding, colored swatch indicator, active state with 2px primary border. Uses `.card-surface` class. |
| Trail Node | `features/evaluation-trail/reasoning-trail/trail-node-template.ts` | Rounded-rect node container with per-variant borders. Uses `.card-surface` class for background. |

## Gaps

1. **No explicit role**: The card could benefit from `role="group"` with an `aria-label` derived from projected header content, but this is a minor enhancement.
