import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Solution } from '../../models/solution.model';
import { SolutionCardComponent } from '../pipeline/solution-card.component';

@Component({
  selector: 'app-solution-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SolutionCardComponent],
  template: `
    <div class="stack">
      @for (sol of solutions(); track sol.id; let i = $index) {
        <app-solution-card [solution]="sol" [index]="i" />
      }
    </div>
  `,
  styles: [`
    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `],
})
export class SolutionStackComponent {
  readonly solutions = input.required<Solution[]>();
}
