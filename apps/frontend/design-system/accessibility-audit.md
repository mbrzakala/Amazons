# Accessibility Audit — WCAG Contrast Ratios

Computed: 2026-07-04
Method: WCAG 2.1 relative luminance formula, (L1 + 0.05) / (L2 + 0.05)
Standard: AA = 4.5:1 (normal text), 3:1 (large text ≥18pt or ≥14pt bold); AAA = 7:1 (normal), 4.5:1 (large)

## Text/Background Pairings in Active Use

| Pairing | Foreground | Background | Ratio | AA (normal) | AAA (normal) | Status |
|---|---|---|---|---|---|---|
| Primary text on canvas | #191c1d (on-surface) | #f8f9fa (surface) | 16.33:1 | PASS | PASS | ✅ |
| Secondary text on canvas | #45464c (on-surface-variant) | #f8f9fa (surface) | 8.93:1 | PASS | PASS | ✅ |
| Primary text on cards | #191c1d (on-surface) | #ffffff (surface-container-lowest) | 17.22:1 | PASS | PASS | ✅ |
| Secondary text on cards | #45464c (on-surface-variant) | #ffffff (surface-container-lowest) | 9.41:1 | PASS | PASS | ✅ |
| Text on primary buttons | #ffffff (on-primary) | #111827 (primary) | 17.75:1 | PASS | PASS | ✅ |
| Accent on white (Recommended/Running) | #2563eb (accent) | #ffffff (white) | 5.17:1 | PASS | FAIL | ✅ AA |
| Accent on surface | #2563eb (accent) | #f8f9fa (surface) | 4.90:1 | PASS | FAIL | ✅ AA (marginal) |
| Secondary text on surface | #585f6c (secondary) | #f8f9fa (surface) | 6.09:1 | PASS | FAIL | ✅ AA |
| Error text on white | #ba1a1a (error) | #ffffff (white) | 6.46:1 | PASS | FAIL | ✅ AA |
| Text on error bg | #ffffff (on-error) | #ba1a1a (error) | 6.46:1 | PASS | FAIL | ✅ AA |
| Text on recommended-row tint | #191c1d (on-surface) | #dce2f7 (primary-fixed) | 13.33:1 | PASS | PASS | ✅ |
| Secondary text on recommended-row tint | #45464c (on-surface-variant) | #dce2f7 (primary-fixed) | 7.29:1 | PASS | PASS | ✅ |

## Failures Found and Fixed

| Pairing | Foreground | Background | Ratio | Issue | Fix Applied |
|---|---|---|---|---|---|
| Pending chip text | #76777d (outline) | #f8f9fa (surface) | 4.23:1 | Below AA 4.5:1 | Changed to `--color-on-surface-variant` (8.93:1) in `status-chip.component.ts` |
| Done phase text | #76777d (outline) | #f8f9fa (surface) | 4.23:1 | Below AA 4.5:1 | Changed to `--color-on-surface-variant` (8.93:1) in `phase-breadcrumb.component.ts` |
| Upcoming phase text | #c6c6cd (outline-variant) | #f8f9fa (surface) | 1.61:1 | Far below AA | Changed to `--color-secondary` (6.09:1) in `phase-breadcrumb.component.ts` |

## Border/Stroke Pairings (not subject to text contrast, logged for completeness)

| Element | Stroke token | Ratio vs surface | Notes |
|---|---|---|---|
| Default card/input border | #c6c6cd (outline-variant) | 1.61:1 | Decorative; non-text. WCAG 1.4.11 non-text contrast requires 3:1 for UI components. See note below. |
| Outline border (focused secondary) | #76777d (outline) | 4.23:1 | Used for secondary borders. Passes 3:1 non-text contrast. |
| Primary border (active/focus) | #111827 (primary) | 16.33:1 | Strong contrast. |

## WCAG 1.4.11 Non-Text Contrast Note

`--color-outline-variant` (#c6c6cd) at 1.61:1 is below the 3:1 threshold for non-text contrast (UI component boundaries). This affects:
- Default 1px borders on cards, inputs, and table cells

**Assessment**: The design system spec explicitly defines this as the default border color. The borders are supplementary to other visual cues (background fill differences, spacing). For interactive elements (inputs), the focus state switches to `--border-2-primary` (2px solid #111827, 16.33:1) which exceeds the requirement. For non-interactive containers, the low-contrast border is an intentional aesthetic choice (subtle delineation). 

**Recommendation**: Accept as-is for static containers. Ensure all interactive elements have a clear 3:1+ focus indicator (already satisfied by `--border-2-primary`). If a stricter interpretation is needed, darken `--color-outline-variant` to at least #a0a1a8 (3.04:1) — but this changes the design's visual character and should be a stakeholder decision.

## Accent Color Usage Note

`--color-accent` (#2563eb) at 4.90:1 on surface passes AA for normal text but is marginal. The spec reserves this color exclusively for:
- "Recommended" pathway highlighting (large text/icon, 3:1 threshold — comfortable pass)
- "Running" status (pill border + dot, non-text — 3:1 threshold, passes)

No body text uses the accent color. The marginal 4.90:1 ratio is therefore not a practical concern.
