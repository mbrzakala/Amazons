import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationTableComponent } from './evaluation-table/evaluation-table';
import { ReasoningTrailComponent } from './reasoning-trail/reasoning-trail';
import { NodeDetailPanelComponent } from './node-detail-panel.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { RdCardComponent } from '../../shared/ui/rd-card.component';
import { SolveSessionService } from '../../core/solve-session.service';
import { downloadJson } from '../../core/download.util';

@Component({
  selector: 'app-evaluation-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EvaluationTableComponent, ReasoningTrailComponent, NodeDetailPanelComponent, ButtonComponent, RdCardComponent],
  template: `
    <div class="page">
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <div>
            <span class="text-label-caps stage-label">Workflow Stage</span>
            <h1 class="text-headline-lg heading">Evaluation &amp; Reasoning Trail</h1>
          </div>
          <div class="header-actions">
            <app-button variant="secondary" (buttonClick)="onDownloadReport()">
              <span leading-icon class="material-symbols-outlined" aria-hidden="true">download</span>
              <span class="text-label-mono">{{ reportDownloaded() ? 'REPORT READY' : 'DOWNLOAD REPORT' }}</span>
            </app-button>
            <app-button variant="primary" (buttonClick)="onViewFullTrail()">
              <span leading-icon class="material-symbols-outlined" aria-hidden="true">visibility</span>
              <span class="text-label-mono">{{ fullTrailView() ? 'COLLAPSE TRAIL' : 'VIEW FULL TRAIL' }}</span>
            </app-button>
          </div>
        </div>

        <!-- Section 1: Evaluation Table -->
        <app-rd-card>
          <div card-header>
            <div class="section-title-group">
              <span class="material-symbols-outlined" aria-hidden="true">analytics</span>
              <h2 class="text-title-sm section-title">Evaluation Table</h2>
            </div>
          </div>
          <app-evaluation-table
            [rows]="session.evaluation()"
            [recommendedSolutionId]="session.recommendedRowId()"
            [selectedId]="selectedId()"
            (rowSelected)="selectedId.set($event)"
          />
        </app-rd-card>

        <!-- Section 2: Reasoning Trail (NGD) -->
        <div class="trail-section" [class.expanded]="fullTrailView()">
          <app-rd-card>
            <div card-header>
              <div class="section-title-group">
                <span class="material-symbols-outlined" aria-hidden="true">account_tree</span>
                <h2 class="text-title-sm section-title">Reasoning Trail (NGD)</h2>
              </div>
            </div>
            <app-reasoning-trail
              [nodes]="session.trailNodes()"
              [edges]="session.trailEdges()"
              [selectedId]="selectedId()"
              (nodeSelected)="selectedId.set($event)"
            />
          </app-rd-card>
        </div>

        <!-- Section 3: Node Detail Panel -->
        <app-node-detail-panel [node]="selectedNode()" />

        <!-- Bottom Actions -->
        <div class="bottom-actions">
          <app-button variant="secondary" (buttonClick)="onBackToSelection()">
            <span class="text-label-mono">Back to Selection</span>
          </app-button>
          <app-button variant="primary" (buttonClick)="onInitiateValidation()">
            <span class="text-label-mono">Initiate Final Validation</span>
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: var(--space-lg);
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid var(--color-primary);
      padding-bottom: var(--space-md);
    }

    .stage-label {
      color: var(--color-on-surface-variant);
      text-transform: uppercase;
      display: block;
      margin-bottom: var(--space-xs);
    }

    .heading {
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .header-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .header-actions .material-symbols-outlined {
      font-size: 18px;
    }

    .section-title-group {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .section-title {
      text-transform: uppercase;
    }

    .trail-section {
      position: relative;
    }
    .trail-section ::ng-deep .card {
      min-height: 600px;
      overflow: hidden;
    }
    .trail-section.expanded ::ng-deep .card {
      min-height: 800px;
    }

    .bottom-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-surface-container);
      border: var(--border-1);
    }
  `],
})
export class EvaluationPage implements OnInit {
  public readonly session = inject(SolveSessionService);
  private readonly router = inject(Router);

  readonly reportDownloaded = signal(false);
  readonly fullTrailView = signal(false);
  readonly selectedId = signal<string | null>(null);

  readonly selectedNode = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.session.trailNodes().find((node) => node.id === id) ?? null;
  });

  ngOnInit(): void {
    this.session.loadEvaluationData();
  }

  onDownloadReport(): void {
    const report = {
      problem: this.session.problem(),
      trizReformulation: this.session.trizReformulation(),
      secondMethodReformulation: this.session.secondMethodReformulation(),
      trizSolutions: this.session.trizSolutions(),
      secondMethodSolutions: this.session.secondMethodSolutions(),
      evaluation: this.session.evaluation(),
      recommendation: this.session.recommendation(),
      trail: {
        nodes: this.session.trailNodes(),
        edges: this.session.trailEdges(),
      },
    };
    downloadJson('evaluation-report.json', report);
    this.reportDownloaded.set(true);
  }

  onViewFullTrail(): void {
    this.fullTrailView.set(!this.fullTrailView());
  }

  onBackToSelection(): void {
    this.router.navigate(['/pipeline']);
  }

  onInitiateValidation(): void {
    if (confirm('This will clear the current problem, candidates, and evaluation. Continue?')) {
      this.session.reset();
      this.router.navigate(['/']);
    }
  }
}
