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
| `title` | `string` | `''` | Optional header title. When empty, the entire header section is omitted. |
| `subtitle` | `string` | `''` | Optional header subtitle rendered in `text-label-mono` to the right of the title. |
| `active` | `boolean` | `false` | When true, switches the border from 1px outline-variant to 2px solid primary. |

## Content Projection

Single `<ng-content />` slot in the body region. No named slots.

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
| Background | `--color-surface-container-lowest` | `#ffffff` |
| Border (default) | `--border-1` | `1px solid #c6c6cd` |
| Border (active) | `--border-2-primary` | `2px solid #111827` |
| Radius | `--radius-default` (implicit, not yet applied — see Gaps) | `0.25rem` |

### 2. Header

Only rendered when `title()` is truthy.

| Part | Token | Value |
|---|---|---|
| Padding | `--space-md` `--space-lg` | `16px 24px` |
| Bottom border | `--border-1` | `1px solid #c6c6cd` |
| Layout | flex, space-between, center | — |
| Gap | `--space-md` | `16px` |

**Title**: `<h4>` with class `text-title-sm` (Geist 18/24, 500) overridden to `font-weight: 700`. Color: inherited `--color-on-surface`.

**Subtitle**: `<span>` with class `text-label-mono` (JetBrains Mono 13/16, 500, 0.05em tracking) overridden to `font-size: 10px; text-transform: uppercase`. Color: `--color-on-surface-variant` (#45464c, 8.93:1 on white — AA pass).

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
--color-surface-container-lowest   card background
--color-outline-variant            default border, header bottom border
--color-primary                    active border
--color-on-surface                 title text (inherited)
--color-on-surface-variant         subtitle text
--space-md                         header vertical padding, header gap
--space-lg                         header horizontal padding, body padding
--text-title-sm                    title typography
--text-label-mono                  subtitle typography
--text-label-mono-tracking         subtitle letter-spacing
```

No hardcoded hex or px values. All values reference CSS custom properties from `styles.scss`.

## Accessibility

- **Heading hierarchy**: Title is `<h4>`. Must be placed in a context where `<h1>` (page heading) and `<h2>`/`<h3>` (section headings) exist above it. On Screen A, the card sits below `<h1>` — correct. On Screen B, reformulation cards sit below `<h2>` method headers — correct.
- **Contrast**: Title (on-surface on white) = 17.22:1. Subtitle (on-surface-variant on white) = 9.41:1. Both pass AA and AAA.
- **Keyboard**: Card itself is not focusable (it's a container, not interactive). Interactive elements projected into the body must provide their own focus indicators.
- **Screen reader**: Header + body structure is semantic. No ARIA attributes needed on the card itself.

## Derivative Components

The R&D Card pattern is extended by:

| Component | File | Differences |
|---|---|---|
| Solution Card | `features/pipeline/solution-card.component.ts` | Adds status chip, hover state, progress bar (running), provenance footer, 2-line description clamp. Padding is `--space-md` (16px) instead of `--space-lg`. |
| Reformulation Card | Inline in `method-column.component.ts` | Uses the card visual pattern but is not `app-rd-card` — it's a `<div class="reform-card">` with the same border/background tokens but custom field layout. |
| Hat Card | Inline in `method-column.component.ts` | Mini-card variant: smaller padding, colored swatch indicator, active state with 2px primary border. |

## Gaps

1. **Radius not applied**: The spec calls for `--radius-default` (0.25rem) on standard containers. The current `app-rd-card` does not set `border-radius`. This should be added to the `.card` class.
2. **No explicit role**: The card could benefit from `role="group"` with an `aria-label` derived from the title, but this is a minor enhancement.
