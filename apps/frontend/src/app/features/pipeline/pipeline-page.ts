import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MethodColumnComponent } from './method-column.component';
import { StageDividerComponent } from '../../shared/ui/stage-divider.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SolveSessionService } from '../../core/solve-session.service';
import { FakeApiService } from '../../core/fake-api.service';
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
  private readonly fakeApi = inject(FakeApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
    const columns = this.fakeApi.getReformulations();
    this.methodColumns.set(columns);
    this.session.setTrizReformulation(columns[0]);
    this.session.setSecondMethodReformulation(columns[1]);

    this.fakeApi
      .simulateProgress(columns)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) => {
        this.methodColumns.set(updated);
        this.session.setTrizReformulation(updated[0]);
        this.session.setSecondMethodReformulation(updated[1]);
      });
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
    const rows = this.fakeApi.getEvaluation();
    this.session.setEvaluation(rows);
    this.session.setTrail(this.fakeApi.getTrailNodes(), this.fakeApi.getTrailEdges());
    this.router.navigate(['/evaluation']);
  }
}
