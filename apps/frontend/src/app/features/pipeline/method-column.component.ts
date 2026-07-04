import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MethodColumn } from '../../models/solution.model';
import { StatusChipComponent } from '../../shared/ui/status-chip.component';
import { StageDividerComponent } from '../../shared/ui/stage-divider.component';
import { SolutionCardComponent } from './solution-card.component';
import { SixHatsGridComponent } from './six-hats-grid.component';

@Component({
  selector: 'app-method-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusChipComponent, StageDividerComponent, SolutionCardComponent, SixHatsGridComponent],
  template: `
    <div class="column">
      <!-- Method Header -->
      <div class="method-header">
        <h3 class="text-headline-md">{{ column().methodName }}</h3>
        <app-status-chip [status]="column().status" />
      </div>

      <!-- TRIZ-style Reformulation Card -->
      @if (column().reformulation.improvingParameter) {
        <div class="reform-card">
          <div class="field">
            <span class="text-label-caps field-label">IMPROVING PARAMETER</span>
            <div class="field-value text-label-mono">{{ column().reformulation.improvingParameter }}</div>
          </div>
          <div class="field">
            <span class="text-label-caps field-label">WORSENING PARAMETER</span>
            <div class="field-value text-label-mono">{{ column().reformulation.worseningParameter }}</div>
          </div>
          <div class="field contradiction">
            <span class="text-label-caps field-label">CONTRADICTION STATEMENT</span>
            <p class="text-body-md contradiction-text">{{ column().reformulation.contradictionStatement }}</p>
          </div>
        </div>
      }

      <!-- Hats-style Reformulation Card -->
      @if (column().reformulation.hatsAnalysis) {
        <app-six-hats-grid [hats]="column().reformulation.hatsAnalysis!" />
      }

      <!-- Solutions Divider -->
      <app-stage-divider [label]="solutionsLabel()" [dashed]="true" />

      <!-- Solution Cards Stack -->
      <div class="solutions-stack">
        @for (sol of column().solutions; track sol.id; let i = $index) {
          <app-solution-card [solution]="sol" [index]="i" />
        }
        @if (column().status === 'running') {
          <app-solution-card
            [solution]="{ id: 'pending', title: '', methodId: column().methodId, methodName: column().methodName, description: '', provenance: '', status: 'pending' }"
            [index]="column().solutions.length"
          />
        }
      </div>
    </div>
  `,
  styles: [`
    .column {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    .method-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-sm);
    }
    .reform-card {
      padding: var(--space-lg);
      background: var(--color-surface-container-lowest);
      border: var(--border-1);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
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
    .solutions-stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `],
})
export class MethodColumnComponent {
  readonly column = input.required<MethodColumn>();

  solutionsLabel(): string {
    const name = this.column().methodName.split(' ')[0];
    return `Proposed Solutions (${name})`;
  }
}
