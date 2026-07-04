---
stage: 2-design-system
task: 6
---

# 6. AI Agent Component Generation

**What to do:** Generate the first real UI components by prompting the MCP-connected design system, turning design intent into shippable code.

**How:**
1. For each component, prompt against the MCP-connected design system by name (tokens, variants, states) — never a vague description like "make it look modern."
2. Generate the component with Claude (reasoning/planning the structure) → Devin IDE (scaffold and file-write).
3. Confirm generated code references tokens by name, not hardcoded values, and covers every state/variant from the component's documented anatomy.

**Recommended tool:** Claude → Devin IDE. Backup: Antigravity, specifically to visually verify a component actually renders correctly once written (Claude/Devin can produce correct-looking code that still breaks visually); manual coding directly against the tokens/anatomy file, as a last resort only.

## Gate

- [ ] Every generation prompt references the MCP-connected design system by name — no vague/freeform styling prompts.
- [ ] Generated code uses token names, not hardcoded hex/px values.
- [ ] Every documented state and variant for that component is implemented, not just the happy-path look.

Last task — once it passes, the stage is done.

## Result

**Scope:** Generate the first components of the product's real UI from the MCP-connected design system (tokens + component anatomy), so design intent ships as working, on-token code.

**DoD:**
- [ ] At least one real product component is generated and references design tokens by name.
- [ ] The component covers all documented states/variants (not just default).
- [ ] Output was visually verified (screenshot or live render) against the Stitch project/anatomy source.

**Layers:** frontend: components, design tokens.
