import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationTableComponent } from './evaluation-table.component';
import { ReasoningTrailComponent } from './reasoning-trail.component';
import { SolveSessionService } from '../../core/solve-session.service';
import { FakeApiService } from '../../core/fake-api.service';
import { EvaluationRow, TrailNode, TrailEdge } from '../../models/evaluation.model';

@Component({
  selector: 'app-evaluation-page',
  templateUrl: './evaluation-page.html',
  styleUrl: './evaluation-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EvaluationTableComponent, ReasoningTrailComponent],
})
export class EvaluationPage implements OnInit {
  private readonly session = inject(SolveSessionService);
  private readonly fakeApi = inject(FakeApiService);
  private readonly router = inject(Router);

  readonly rows = signal<EvaluationRow[]>([]);
  readonly recommendedRowId = signal<string | null>(null);
  readonly trailNodes = signal<TrailNode[]>([]);
  readonly trailEdges = signal<TrailEdge[]>([]);
  readonly reportDownloaded = signal(false);
  readonly fullTrailView = signal(false);

  ngOnInit(): void {
    let rows = this.session.evaluation();
    if (rows.length === 0) {
      rows = this.fakeApi.getEvaluation();
      this.session.setEvaluation(rows);
      this.session.setTrail(this.fakeApi.getTrailNodes(), this.fakeApi.getTrailEdges());
    }
    this.rows.set(rows);
    this.recommendedRowId.set(this.session.recommendedRowId());

    const nodes = this.session.trailNodes();
    const edges = this.session.trailEdges();
    this.trailNodes.set(nodes.length > 0 ? nodes : this.fakeApi.getTrailNodes());
    this.trailEdges.set(edges.length > 0 ? edges : this.fakeApi.getTrailEdges());
  }

  onDownloadReport(): void {
    this.reportDownloaded.set(true);
  }

  onViewFullTrail(): void {
    this.fullTrailView.set(!this.fullTrailView());
  }

  onBackToSelection(): void {
    this.router.navigate(['/pipeline']);
  }

  onInitiateValidation(): void {
    this.session.reset();
    this.router.navigate(['/']);
  }
}
