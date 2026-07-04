import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { HatAnalysis } from '../../models/problem.model';

@Component({
  selector: 'app-six-hats-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hats-grid">
      @for (hat of hats(); track hat.hatName) {
        <div class="hat-card" [class.active]="hat.active">
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
      background: var(--color-surface-container-lowest);
      border: var(--border-1);
    }
    .hat-card {
      padding: var(--space-sm);
      border: var(--border-1);
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
      width: 12px;
      height: 12px;
      border: 1px solid var(--color-primary);
    }
    .hat-name {
      color: var(--color-on-surface-variant);
    }
    .hat-note {
      font-size: 12px;
      line-height: 1.3;
    }
    .hat-card.active .hat-note {
      font-weight: 700;
    }
  `],
})
export class SixHatsGridComponent {
  readonly hats = input.required<HatAnalysis[]>();
}
