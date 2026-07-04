import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export interface Phase {
  label: string;
  state: 'active' | 'done' | 'upcoming';
}

@Component({
  selector: 'app-phase-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="breadcrumb">
      @for (phase of phases(); track phase.label; let i = $index) {
        @if (i > 0) {
          <div class="connector" [class.active]="phase.state !== 'upcoming'"></div>
        }
        <span class="phase" [class.active]="phase.state === 'active'" [class.done]="phase.state === 'done'" [class.upcoming]="phase.state === 'upcoming'">
          {{ phase.label }}
        </span>
      }
    </div>
  `,
  styles: [`
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }
    .phase {
      font: var(--text-label-caps);
      letter-spacing: var(--text-label-caps-tracking);
      text-transform: uppercase;
      padding: var(--space-xs) var(--space-sm);
      border: 1px solid var(--color-outline-variant);
    }
    .phase.active {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .phase.done {
      color: var(--color-on-surface-variant);
    }
    .phase.upcoming {
      color: var(--color-secondary);
      border-color: var(--color-outline-variant);
    }
    .connector {
      width: var(--space-md);
      height: 1px;
      background: var(--color-outline-variant);
    }
    .connector.active {
      background: var(--color-outline);
    }
  `],
})
export class PhaseBreadcrumbComponent {
  readonly phases = input.required<Phase[]>();
}
