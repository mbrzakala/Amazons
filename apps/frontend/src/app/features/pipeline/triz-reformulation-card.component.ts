import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SolutionStatus } from '../../models/solution.model';
import { StatusChipComponent } from '../../shared/ui/status-chip.component';

@Component({
  selector: 'app-triz-reformulation-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusChipComponent],
  template: `
    <div class="reform-card">
      <div class="card-header">
        <span class="text-label-caps card-title">TRIZ Reformulation</span>
        <app-status-chip [status]="status()" />
      </div>
      <div class="field">
        <span class="text-label-caps field-label">IMPROVING PARAMETER</span>
        <div class="field-value text-label-mono">{{ improvingParameter() }}</div>
      </div>
      <div class="field">
        <span class="text-label-caps field-label">WORSENING PARAMETER</span>
        <div class="field-value text-label-mono">{{ worseningParameter() }}</div>
      </div>
      <div class="field contradiction">
        <span class="text-label-caps field-label">CONTRADICTION STATEMENT</span>
        <p class="text-body-md contradiction-text">{{ contradictionStatement() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .reform-card {
      padding: var(--space-lg);
      background: var(--color-surface-container-lowest);
      border: var(--border-1);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-title {
      color: var(--color-on-surface-variant);
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .field-label {
      color: var(--color-on-surface-variant);
    }
    .field-value {
      padding: var(--space-sm);
      background: var(--color-surface);
      border: var(--border-1);
    }
    .contradiction {
      padding-top: var(--space-md);
      border-top: var(--border-1);
    }
    .contradiction-text {
      font-style: italic;
      line-height: 1.6;
    }
  `],
})
export class TrizReformulationCardComponent {
  readonly improvingParameter = input.required<string>();
  readonly worseningParameter = input.required<string>();
  readonly contradictionStatement = input.required<string>();
  readonly status = input.required<SolutionStatus>();
}
