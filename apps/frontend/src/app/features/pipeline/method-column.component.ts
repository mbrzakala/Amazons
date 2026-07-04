import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { MethodColumn } from '../../models/solution.model';
import { StatusChipComponent } from '../../shared/ui/status-chip.component';
import { StageDividerComponent } from '../../shared/ui/stage-divider.component';
import { SolutionStackComponent } from './solution-stack.component';
import { SixHatsGridComponent } from './six-hats-grid.component';
import { TrizReformulationCardComponent } from './triz-reformulation-card.component';

@Component({
  selector: 'app-method-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusChipComponent, StageDividerComponent, SolutionStackComponent, SixHatsGridComponent, TrizReformulationCardComponent],
  template: `
    <div class="column">
      <!-- Method Header -->
      <div class="method-header">
        <h3 class="text-headline-md">{{ column().methodName }}</h3>
        <app-status-chip [status]="column().status" />
      </div>

      <!-- TRIZ-style Reformulation Card -->
      @if (column().reformulation.improvingParameter) {
        <app-triz-reformulation-card
          [improvingParameter]="column().reformulation.improvingParameter!"
          [worseningParameter]="column().reformulation.worseningParameter!"
          [contradictionStatement]="column().reformulation.contradictionStatement!"
          [status]="column().status"
        />
      }

      <!-- Hats-style Reformulation Card -->
      @if (column().reformulation.hatsAnalysis) {
        <app-six-hats-grid [hats]="column().reformulation.hatsAnalysis!" />
      }

      <!-- Solutions Divider -->
      <app-stage-divider [label]="solutionsLabel()" [dashed]="true" />

      <!-- Solution Cards Stack -->
      <app-solution-stack [solutions]="column().solutions" />
      @if (column().status === 'running') {
        <app-solution-stack [solutions]="pendingSolutions()" />
      }
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
  `],
})
export class MethodColumnComponent {
  readonly column = input.required<MethodColumn>();

  solutionsLabel(): string {
    const name = this.column().methodName.split(' ')[0];
    return `Proposed Solutions (${name})`;
  }

  readonly pendingSolutions = computed(() =>
    this.column().status === 'running'
      ? [{ id: 'pending', title: '', methodId: this.column().methodId, methodName: this.column().methodName, description: '', provenance: '', status: 'pending' as const }]
      : [],
  );
}
