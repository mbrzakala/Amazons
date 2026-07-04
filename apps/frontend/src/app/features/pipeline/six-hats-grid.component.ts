import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { HatAnalysis } from '../../models/problem.model';

@Component({
  selector: 'app-six-hats-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hats-grid card-surface">
      @for (hat of hats(); track hat.hatName) {
        <div class="hat-card card-surface" [class.active]="hat.active">
          <div class="hat-header">
            <div class="hat-swatch" [style.background]="hat.color" aria-hidden="true"></div>
            <span class="text-label-caps hat-name">{{ hat.hatName }}</span>
          </div>
          <p class="hat-note">{{ hat.note }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .hats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      padding: var(--space-lg);
    }
    .hat-card {
      padding: var(--space-sm);
    }
    .hat-card.active {
      border: var(--border-2-primary);
    }
    .hat-header {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      margin-bottom: var(--space-xs);
    }
    .hat-swatch {
      width: var(--space-sm);
      height: var(--space-sm);
      border: 1px solid var(--color-primary);
    }
    .hat-name {
      color: var(--color-on-surface-variant);
    }
    .hat-note {
      font: var(--text-label-mono);
      line-height: 1.3;
    }
    .hat-card.active .hat-note {
      font-weight: 700;
    }

    @media (max-width: 767px) {
      .hats-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class SixHatsGridComponent {
  readonly hats = input.required<HatAnalysis[]>();
}
