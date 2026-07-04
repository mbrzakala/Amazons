import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MethodColumnComponent } from './method-column.component';
import { StageDividerComponent } from '../../shared/ui/stage-divider.component';
import { SolveSessionService } from '../../core/solve-session.service';
import { FakeApiService } from '../../core/fake-api.service';
import { MethodColumn } from '../../models/solution.model';

@Component({
  selector: 'app-pipeline-page',
  templateUrl: './pipeline-page.html',
  styleUrl: './pipeline-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MethodColumnComponent, StageDividerComponent],
})
export class PipelinePage implements OnInit {
  private readonly session = inject(SolveSessionService);
  private readonly fakeApi = inject(FakeApiService);
  private readonly router = inject(Router);

  readonly methodColumns = signal<MethodColumn[]>([]);
  readonly isProcessing = signal<boolean>(true);

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
  }

  onSynthesize(): void {
    const rows = this.fakeApi.getEvaluation();
    this.session.setEvaluation(rows);
    this.session.setTrail(this.fakeApi.getTrailNodes(), this.fakeApi.getTrailEdges());
    this.router.navigate(['/evaluation']);
  }
}
