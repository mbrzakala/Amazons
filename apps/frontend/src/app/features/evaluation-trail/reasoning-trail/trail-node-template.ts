import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';
import { type NgDiagramNodeTemplate, type Node } from 'ng-diagram';

interface TrailNodeData {
  label: string;
  title: string;
  nodeType: 'root' | 'reformulation' | 'candidate' | 'final';
  isCriticalPath: boolean;
  skeleton: boolean;
}

@Component({
  selector: 'app-trail-node-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="trail-node card-surface"
      [class.root]="data().nodeType === 'root'"
      [class.reformulation]="data().nodeType === 'reformulation'"
      [class.candidate]="data().nodeType === 'candidate'"
      [class.final]="data().nodeType === 'final'"
      [class.critical]="data().isCriticalPath"
      [class.trail-selected]="node().id === selectedId()"
      (click)="onNodeClick()"
    >
      <span class="node-label text-label-caps">{{ data().label }}</span>
      @if (data().skeleton) {
        <div class="skeleton-line sk-line"></div>
        <div class="skeleton-line sk-line short"></div>
      } @else {
        <div class="node-title text-label-mono" [class.bold]="data().isCriticalPath">
          {{ data().title }}
        </div>
      }
    </div>
  `,
  styles: [`
    .trail-node {
      padding: var(--space-sm);
      text-align: center;
      border-radius: var(--radius-lg);
    }
    .trail-node.root {
      border: 1px solid var(--color-primary);
    }
    .trail-node.reformulation {
      border: var(--border-1);
      background: var(--color-surface-container-low);
    }
    .trail-node.candidate {
      border: 2px solid var(--color-outline-variant);
    }
    .trail-node.candidate.critical {
      border: var(--border-2-primary);
      background: var(--color-primary);
      color: var(--color-on-primary);
    }
    .trail-node.final {
      border: var(--border-2-primary);
      padding: var(--space-md);
    }
    .node-label {
      display: block;
      font: var(--text-label-caps);
      color: var(--color-on-surface-variant);
      margin-bottom: var(--space-xs);
    }
    .trail-node.candidate.critical .node-label {
      opacity: 0.7;
    }
    .node-title {
      font: var(--text-label-mono);
      text-transform: uppercase;
    }
    .node-title.bold {
      font-weight: 700;
    }
    .trail-node.final .node-title {
      font: var(--text-title-sm);
      font-weight: 700;
      line-height: 1;
    }
    .sk-line {
      height: var(--space-sm);
      width: 100%;
      margin-bottom: var(--space-xs);
    }
    .sk-line.short {
      width: 80%;
    }
  `],
})
export class TrailNodeTemplateComponent implements NgDiagramNodeTemplate {
  readonly node = input.required<Node>();
  readonly selectedId = input<string | null>(null);
  readonly nodeSelected = output<string>();

  readonly data = computed(() => this.node().data as unknown as TrailNodeData);

  onNodeClick(): void {
    this.nodeSelected.emit(this.node().id);
  }
}
