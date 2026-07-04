# R&D Card — Anatomy

The R&D Card is the most reused container in the app. Problem input card, reformulation cards, evaluation table wrapper, and reasoning-trail panel all sit inside this shape.

## Parts

### 1. Header slot (optional) — `[card-header]`

Projected via `<ng-content select="[card-header]">`. Contains:
- **Title** — bold, `text-title-sm` typography class
- **Trailing slot** (optional) — for a status chip or icon button, projected inside the header via a nested `ng-content` or placed by the consumer inside the `[card-header]` wrapper

When the header slot is projected, a **horizontal divider rule** (`1px solid var(--color-outline-variant)`) visually separates it from the body.

### 2. Body slot (default)

Projected via `<ng-content>`. This is the main content area. Receives `--space-lg` (24px) padding.

## Variants

### Default

- `1px solid var(--color-outline-variant)` border
- `var(--radius-default)` (4px) corner radius
- `var(--color-surface-container-lowest)` (#ffffff) background
- No shadow

### Active-focused (Level 2)

Triggered by `active` input set to `true`.
- Border swaps to `2px solid var(--color-primary)`
- All other properties remain the same

## States

### Default

The resting state — no additional styling beyond the variant's border/background/radius.

### Hover (interactive cards only)

Only applies when the card is interactive (e.g. clickable cards on Screen B). The border-color shifts to `var(--color-primary)` on hover. This is opt-in via an `interactive` input — non-interactive cards do not show a hover state.

## Token usage (no hardcoded values)

| Property | Token |
|---|---|
| Border (default) | `var(--border-1)` → `1px solid var(--color-outline-variant)` |
| Border (active) | `var(--border-2-primary)` → `2px solid var(--color-primary)` |
| Corner radius | `var(--radius-default)` |
| Background | `var(--color-surface-container-lowest)` |
| Body padding | `var(--space-lg)` |
| Header padding | `var(--space-md) var(--space-lg)` |
| Header divider | `var(--border-1)` |

## Component API

```typescript
export class RdCardComponent {
  readonly active = input<boolean>(false);       // switches to 2px primary border
  readonly interactive = input<boolean>(false);   // enables hover border-color shift
}
```

### Template structure

```html
<div class="card" [class.active]="active()" [class.interactive]="interactive()">
  <ng-content select="[card-header]" />
  <div class="body">
    <ng-content />
  </div>
</div>
```

### Usage example

```html
<app-rd-card>
  <div card-header>
    <h4 class="text-title-sm">Card Title</h4>
    <app-status-chip status="done" />
  </div>
  <!-- body content projected here -->
</app-rd-card>

<app-rd-card [active]="true" [interactive]="true">
  <!-- active + interactive card -->
</app-rd-card>
```
