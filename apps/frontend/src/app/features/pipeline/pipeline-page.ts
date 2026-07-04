import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MethodColumnComponent } from './method-column.component';
import { StageDividerComponent } from '../../shared/ui/stage-divider.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SolveSessionService } from '../../core/solve-session.service';
import { MethodColumn } from '../../models/solution.model';
import { downloadJson } from '../../core/download.util';

@Component({
  selector: 'app-pipeline-page',
  templateUrl: './pipeline-page.html',
  styleUrl: './pipeline-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MethodColumnComponent, StageDividerComponent, ButtonComponent],
})
export class PipelinePage implements OnInit {
  private readonly session = inject(SolveSessionService);
  private readonly router = inject(Router);

  readonly methodColumns = signal<MethodColumn[]>([]);
  readonly isProcessing = computed(() => !this.allSolutionsReady());

  readonly allSolutionsReady = computed(() => {
    const cols = this.methodColumns();
    if (cols.length === 0) return false;
    return cols.every((col) =>
      col.solutions.length >= 3 && col.solutions.every((s) => s.status === 'done'),
    );
  });

  ngOnInit(): void {
    // Build method columns from real session data (already set by submitProblem()).
    const triz = this.session.trizReformulation();
    const ideation = this.session.secondMethodReformulation();
    const columns: MethodColumn[] = [];
    if (triz) columns.push(triz);
    if (ideation) columns.push(ideation);
    this.methodColumns.set(columns);
  }

  onExportWorkflow(): void {
    const dump = {
      problem: this.session.problem(),
      trizReformulation: this.session.trizReformulation(),
      secondMethodReformulation: this.session.secondMethodReformulation(),
      trizSolutions: this.session.trizSolutions(),
      secondMethodSolutions: this.session.secondMethodSolutions(),
    };
    downloadJson('workflow-export.json', dump);
  }

  onSynthesize(): void {
    // Evaluation data is already set in session by submitProblem() from the
    // real POST /solve response. Navigate to the evaluation page.
    this.router.navigate(['/evaluation']);
  }
}
