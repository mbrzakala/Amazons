---
name: Technical Blueprint
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#45464c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#575e70'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141b2b'
  on-primary-container: '#7d8497'
  inverse-primary: '#c0c6db'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#261906'
  on-tertiary-container: '#968065'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce2f7'
  primary-fixed-dim: '#c0c6db'
  on-primary-fixed: '#141b2b'
  on-primary-fixed-variant: '#404758'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#f9debf'
  tertiary-fixed-dim: '#dcc2a4'
  on-tertiary-fixed: '#261906'
  on-tertiary-fixed-variant: '#55442d'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-page: 32px
---

## Brand & Style
The design system is a high-fidelity "Blueprint" aesthetic tailored for technical R&D and logical workflows. It adopts a **Skeletal Minimalism** approach, prioritizing structure, hierarchy, and information density over decorative flair. 

The brand personality is analytical, transparent, and precise. It should evoke the feeling of a digital lab notebook—a "working" space where the focus is on the reasoning process rather than the final polish. The UI utilizes varying stroke weights and monochromatic contrasts to define relationships between elements, ensuring that the architecture of the application is visible at all times.

## Colors
The palette is strictly grayscale to maintain a wireframe-first mentality, with a single functional accent.
- **Primary/Action:** Solid Black (#111827) for high-contrast labels and active states.
- **Secondary/Stroke:** Mid-gray (#6B7280) for secondary icons and supporting text.
- **Surface:** White (#FFFFFF) for the main canvas, with Very Light Gray (#F9FAFB) used to differentiate background containers or sidebars.
- **Border:** Light-to-Mid Gray (#D1D5DB) for all structural lines and "X-box" placeholders.
- **Highlight (Minimal):** A muted Blue (#2563EB) is reserved exclusively for "Recommended" pathways or active "Running" status states.

## Typography
The system uses a pairing of **Geist** for its neutral, clinical sans-serif qualities and **JetBrains Mono** for data-heavy and technical labels. 

- Use **Geist** for all primary interfaces, inputs, and descriptions to ensure readability.
- Use **JetBrains Mono** for "meta" information: status chips, table headers, IDs, and reasoning steps.
- Hierarchy is established through weight and capitalization rather than color.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy that mimics a technical schematic.
- **Grid:** 12-column grid for desktop with 16px gutters.
- **Sidebar:** A fixed 260px left-hand sidebar for navigation (History, Settings, Lab Tools).
- **Rhythm:** All spacing must be a multiple of 4px. Use generous internal padding in "Cards" (24px) to emphasize the skeletal structure.
- **Sections:** Separate major workflow stages (Input, Reasoning, Evaluation) with 1px horizontal strokes spanning the full container width.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Stroke Weights** rather than shadows. 
- **Level 0 (Canvas):** Pure White (#FFFFFF).
- **Level 1 (Panels):** Faint background (#F9FAFB) with a 1px solid border (#D1D5DB).
- **Level 2 (Modals/Active Cards):** 2px solid border (#111827) to denote focus.
- **Placeholders:** Images or empty states are represented by a box with a 1px diagonal "X" spanning from corner to corner.
- **Shadows:** No ambient shadows are permitted. Use "hard" 1px offsets for a brutalist feel only if a temporary popover is required.

## Shapes
Shapes are predominantly **Sharp** or **Softly Squared** to maintain the engineering aesthetic.
- **Standard UI (Inputs, Cards):** 0.25rem (4px) corner radius.
- **Nodes/Chips:** 1rem (16px) or fully pill-shaped to differentiate "process" elements from "container" elements.
- **Navigation Items:** 0px radius (sharp) to align with the vertical sidebar stroke.

## Components
- **Inputs:** Large, single-stroke text areas with a `#D1D5DB` border. Upon focus, the border weight increases to 2px `#111827`. Labels use `label-caps` typography positioned top-left outside the box.
- **R&D Cards:** Defined by a 1px border. The header is separated by a horizontal rule. Titles (e.g., "TRIZ") are bold.
- **Reasoning Trail (Nodes):** Rounded-rect containers connected by 1px "elbow" connectors (orthogonal lines). No curved paths.
- **Evaluation Table:** A simple grid. Row headers use a light gray fill (#F9FAFB). Cell borders are 1px `#D1D5DB`.
- **Status Chips:** Small pills with 1px borders. "Running" status utilizes a dashed border; "Done" uses a solid 1px black border.
- **Navigation:** Sidebar links are text-only with a leading monospaced icon. Active states are indicated by a 2px vertical "left-accent" bar in solid black.
- **X-Box:** Used for any media placeholder. A light gray box with two crossing diagonal lines.