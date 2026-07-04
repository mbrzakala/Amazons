import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import {
  NgDiagramComponent,
  initializeModel,
  provideNgDiagram,
  NgDiagramNodeTemplateMap,
  NgDiagramModelService,
} from 'ng-diagram';
import { TrailNode, TrailEdge } from '../../models/evaluation.model';
import { TrailNodeTemplateComponent } from './trail-node-template.component';

@Component({
  selector: 'app-reasoning-trail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgDiagramComponent],
  providers: [provideNgDiagram()],
  template: `
    <div class="trail-container">
      <div class="trail-header">
        <div class="legend">
          <div class="legend-item">
            <div class="swatch solid" aria-hidden="true"></div>
            <span class="text-label-caps">NODE</span>
          </div>
          <div class="legend-item">
            <div class="swatch outline" aria-hidden="true"></div>
            <span class="text-label-caps">STEP</span>
          </div>
          <div class="legend-item">
            <div class="swatch line" aria-hidden="true"></div>
            <span class="text-label-caps">CONNECTION</span>
          </div>
        </div>
      </div>

      <div class="graph-area dot-grid-bg">
        <ng-diagram
          [model]="model()"
          [nodeTemplateMap]="nodeTemplateMap"
          [config]="config"
        />
      </div>
    </div>
  `,
  styles: [`
    .trail-container {
      position: relative;
    }
    .trail-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: var(--space-xl);
    }
    .legend {
      display: flex;
      gap: var(--space-md);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font: var(--text-label-caps);
    }
    .swatch {
      width: var(--space-sm);
      height: var(--space-sm);
    }
    .swatch.solid {
      background: var(--color-primary);
    }
    .swatch.outline {
      border: var(--border-1);
    }
    .swatch.line {
      width: var(--space-sm);
      height: 1px;
      background: var(--color-outline-variant);
    }

    .graph-area {
      position: relative;
      width: 100%;
      height: calc(var(--space-xl) * 10);
    }
    .graph-area.dot-grid-bg {
      opacity: 1;
      pointer-events: auto;
    }
    .graph-area.dot-grid-bg::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(
        var(--color-primary) 1px,
        transparent 1px
      );
      background-size: 20px 20px;
      opacity: 0.05;
      pointer-events: none;
      z-index: 0;
    }
    .graph-area ::ng-deep ng-diagram {
      position: relative;
      z-index: 1;
    }
  `],
})
export class ReasoningTrailComponent implements OnInit {
  private readonly modelService = inject(NgDiagramModelService, { optional: true });

  readonly nodes = input.required<TrailNode[]>();
  readonly edges = input.required<TrailEdge[]>();

  readonly nodeTemplateMap = new NgDiagramNodeTemplateMap([
    ['trailNode', TrailNodeTemplateComponent],
  ]);

  readonly config = {
    edgeRouting: {
      defaultRouting: 'orthogonal' as const,
    },
    background: {
      dotSpacing: 20,
    },
  };

  readonly model = signal<ReturnType<typeof initializeModel>>(initializeModel({ nodes: [], edges: [] }));

  readonly hasData = computed(() => this.nodes().length > 0);

  ngOnInit(): void {
    const ngNodes = this.nodes().map((n) => ({
      id: n.id,
      position: this.toXY(n.position.left, n.position.top),
      type: 'trailNode',
      autoSize: false,
      size: this.getNodeSize(n.type),
      data: {
        label: this.getNodeLabel(n),
        title: n.label,
        nodeType: n.type,
        isCriticalPath: n.isCriticalPath,
        skeleton: n.skeleton ?? false,
      },
    }));

    const ngEdges = this.edges().map((e, i) => ({
      id: `edge-${i}`,
      source: e.from,
      target: e.to,
      sourcePort: 'port-right',
      targetPort: 'port-left',
      routing: 'orthogonal' as const,
      data: {},
    }));

    this.model.set(initializeModel({ nodes: ngNodes, edges: ngEdges }));

    if (this.modelService) {
      this.modelService.updateNodes(ngNodes);
      this.modelService.updateEdges(ngEdges);
    }
  }

  private toXY(left: string, top: string): { x: number; y: number } {
    let x = 400;
    if (left.includes('calc')) {
      const match = left.match(/calc\((\d+)%\s*([+-])\s*(\d+)px\)/);
      if (match) {
        const pct = parseInt(match[1], 10);
        const op = match[2];
        const offset = parseInt(match[3], 10);
        x = op === '-' ? 400 - offset : 400 + offset;
      }
    } else if (left.includes('%')) {
      const pct = parseInt(left, 10);
      x = (pct / 100) * 800;
    }
    const y = parseInt(top, 10) || 0;
    return { x, y };
  }

  private getNodeSize(type: TrailNode['type']): { width: number; height: number } {
    switch (type) {
      case 'root':
        return { width: 192, height: 60 };
      case 'reformulation':
        return { width: 224, height: 80 };
      case 'candidate':
        return { width: 192, height: 60 };
      case 'final':
        return { width: 256, height: 80 };
      default:
        return { width: 192, height: 60 };
    }
  }

  private getNodeLabel(node: TrailNode): string {
    const labels: Record<TrailNode['type'], string> = {
      root: 'INITIAL STATE',
      reformulation: 'REFORMULATION',
      candidate: 'CANDIDATE',
      final: 'FINAL RECOMMENDATION',
    };
    if (node.type === 'reformulation') {
      const letter = node.id.split('-')[1]?.toUpperCase() ?? '';
      return `${labels[node.type]} ${letter}`;
    }
    if (node.type === 'candidate') {
      const num = node.id.split('-')[1] ?? '';
      return `CANDIDATE ${String(num).padStart(2, '0')}`;
    }
    return labels[node.type];
  }
}
