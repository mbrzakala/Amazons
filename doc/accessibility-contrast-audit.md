# Accessibility Contrast Audit

Computed WCAG 2.1 contrast ratios for all text/background pairs in the design token set.
Formula: (L1 + 0.05) / (L2 + 0.05), where L is relative luminance per WCAG.
AA threshold: 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold) and UI components.

## Pair 1 — Primary text on surface

| Property | Value |
|---|---|
| Foreground | `--color-on-surface` `#191c1d` |
| Background | `--color-surface` `#f8f9fa` |
| Luminance (fg) | 0.0123 |
| Luminance (bg) | 0.9454 |
| **Contrast ratio** | **15.99:1** |
| AA normal text | ✅ Pass (≥ 4.5:1) |
| AA large text | ✅ Pass (≥ 3:1) |

## Pair 2 — Secondary text on surface

| Property | Value |
|---|---|
| Foreground | `--color-on-surface-variant` `#45464c` |
| Background | `--color-surface` `#f8f9fa` |
| Luminance (fg) | 0.0641 |
| Luminance (bg) | 0.9454 |
| **Contrast ratio** | **8.72:1** |
| AA normal text | ✅ Pass (≥ 4.5:1) |
| AA large text | ✅ Pass (≥ 3:1) |

## Pair 3 — Text on primary (buttons, active states)

| Property | Value |
|---|---|
| Foreground | `--color-on-primary` `#ffffff` |
| Background | `--color-primary` `#111827` |
| Luminance (fg) | 1.0000 |
| Luminance (bg) | 0.0098 |
| **Contrast ratio** | **17.56:1** |
| AA normal text | ✅ Pass (≥ 4.5:1) |
| AA large text | ✅ Pass (≥ 3:1) |

## Pair 4 — Text on error (validation errors)

| Property | Value |
|---|---|
| Foreground | `--color-on-error` `#ffffff` |
| Background | `--color-error` `#ba1a1a` |
| Luminance (fg) | 1.0000 |
| Luminance (bg) | 0.1120 |
| **Contrast ratio** | **6.48:1** |
| AA normal text | ✅ Pass (≥ 4.5:1) |
| AA large text | ✅ Pass (≥ 3:1) |

## Pair 5 — Accent on white (Recommended pathway, Running status)

| Property | Value |
|---|---|
| Foreground | `--color-accent` `#2563eb` |
| Background | `#ffffff` (`--color-surface-container-lowest`) |
| Luminance (fg) | 0.1530 |
| Luminance (bg) | 1.0000 |
| **Contrast ratio** | **5.17:1** |
| AA normal text | ✅ Pass (≥ 4.5:1) |
| AA large text | ✅ Pass (≥ 3:1) |

## Summary

All five pairs pass WCAG AA for both normal and large text. No gaps to flag.

| Pair | Ratio | AA |
|---|---|---|
| on-surface / surface | 15.99:1 | ✅ |
| on-surface-variant / surface | 8.72:1 | ✅ |
| on-primary / primary | 17.56:1 | ✅ |
| on-error / error | 6.48:1 | ✅ |
| accent / white | 5.17:1 | ✅ |

## Post-Build Findings (Chunk 18)

### Keyboard Reachability
- All interactive elements (buttons, nav links, form inputs) are Tab-reachable.
- `:focus-visible` outlines (`var(--border-2-primary)`) present on: `ButtonComponent`, `TopNavComponent`, `SideNavComponent`, `IconButtonComponent`, pipeline footer buttons, evaluation page buttons.
- Disabled nav items use `tabindex="-1"` and `aria-disabled="true"` — correctly removed from tab order.

### Icon Button Labels
- `TopNavComponent`: Settings button has `aria-label="Settings"`, Help button has `aria-label="Help"`.
- `SideNavComponent`: Footer buttons have `aria-label="Settings"` and `aria-label="Documentation"`.
- All `IconButtonComponent` instances require an `ariaLabel` input — verified in the component's template.

### Error Announcement
- `LabeledTextareaComponent` and `LabeledInputComponent`: error messages wrapped in `div` with `aria-live="polite"` and `role="status"`, linked to input via `aria-describedby`.
- `ProblemInputPage`: validation error ("Problem definition is required before solving.") is displayed via `LabeledTextareaComponent`'s `errorMessage` input, which renders it in the `aria-live` region.

### Fixes Applied (Chunk 18 Pass)
- Changed `:focus` → `:focus-visible` on `LabeledInputComponent` and `LabeledTextareaComponent` for keyboard-only focus indication.
- Fixed `errorId` getter → `computed()` signal in both chunk 06 components (was causing TS6234 build error — getter called as function in template).
- Removed hardcoded `text-transform: uppercase` from `ButtonComponent` — text style is now controlled by projected content (`text-label-caps` or `text-label-mono`), per chunk 07 spec.

### Known Gaps
- **Lighthouse audit not yet run live** — the contrast ratios above are computed from token values, not measured against the rendered app. A live Lighthouse run against all three screens is needed to confirm no runtime regressions.
- **Screen reader testing not performed** — manual NVDA/VoiceOver pass recommended before demo.
- **Dead code**: `problem-input.state.ts`, `pipeline.state.ts`, `evaluation.state.ts` are unused — not an a11y issue but cleanup candidate.
