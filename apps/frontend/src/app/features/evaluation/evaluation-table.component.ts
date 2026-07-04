import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { EvaluationRow } from '../../models/evaluation.model';

@Component({
  selector: 'app-evaluation-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Solution Title</th>
            <th>Method</th>
            <th class="num">Feasibility</th>
            <th class="num">Novelty</th>
            <th class="num">Impact</th>
            <th class="num">Risk</th>
            <th class="num">Total Score</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.id) {
            <tr [class.recommended]="isRecommended(row)">
              <td class="title-cell">
                @if (isRecommended(row)) {
                  <span class="material-symbols-outlined star" aria-hidden="true">stars</span>
                }
                <span [class.bold]="isRecommended(row)">{{ row.title }}</span>
              </td>
              <td>{{ row.method }}</td>
              <td class="num">{{ row.feasibility.toFixed(2) }}</td>
              <td class="num">{{ row.novelty.toFixed(2) }}</td>
              <td class="num">{{ row.impact.toFixed(2) }}</td>
              <td class="num">{{ row.risk.toFixed(2) }}</td>
              <td class="num total" [class.recommended-total]="isRecommended(row)">{{ row.totalScore.toFixed(2) }}</td>
            </tr>
          }
        </tbody>
      </table>
      @if (hasRecommended()) {
        <div class="recommended-tab text-label-caps">RECOMMENDED</div>
      }
    </div>
  `,
  styles: [`
    .table-wrapper {
      position: relative;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead tr {
      background: var(--color-surface-container-low);
      border-top: var(--border-1);
      border-bottom: var(--border-1);
    }
    th {
      text-align: left;
      padding: var(--space-md);
      font: var(--text-label-caps);
      letter-spacing: var(--text-label-caps-tracking);
      text-transform: uppercase;
      border-right: var(--border-1);
    }
    th:last-child {
      border-right: none;
    }
    th.num {
      text-align: center;
    }
    tbody {
      font: var(--text-label-mono);
      letter-spacing: var(--text-label-mono-tracking);
    }
    td {
      padding: var(--space-md);
      border-right: var(--border-1);
      border-bottom: var(--border-1);
    }
    td:last-child {
      border-right: none;
    }
    td.num {
      text-align: center;
    }
    tr:hover {
      background: var(--color-surface-container-lowest);
    }
    tr.recommended {
      border: var(--border-2-primary);
      background: var(--color-primary-fixed);
    }
    tr.recommended td {
      border-color: var(--color-primary);
    }
    tr.recommended:hover {
      background: var(--color-primary-fixed);
    }
    .title-cell {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .star {
      color: var(--color-primary);
      font-variation-settings: 'FILL' 1;
    }
    .bold {
      font-weight: 800;
    }
    .total {
      background: var(--color-surface-container);
      font-weight: 700;
    }
    .recommended-total {
      background: var(--color-primary);
      color: var(--color-on-primary);
      font-weight: 800;
    }
    .recommended-tab {
      position: absolute;
      left: calc(-1 * var(--space-md));
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 2px var(--space-xs);
      font: var(--text-label-caps);
    }
  `],
})
export class EvaluationTableComponent {
  readonly rows = input.required<EvaluationRow[]>();
  readonly recommendedRowId = input<string | null>(null);

  readonly hasRecommended = computed(() => this.recommendedRowId() !== null);

  isRecommended(row: EvaluationRow): boolean {
    return row.id === this.recommendedRowId();
  }
}
