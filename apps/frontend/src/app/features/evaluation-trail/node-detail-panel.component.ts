import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RdCardComponent } from '../../shared/ui/rd-card.component';
import { TrailNode } from '../../models/evaluation.model';

@Component({
  selector: 'app-node-detail-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RdCardComponent],
  template: `
    <app-rd-card>
      <div card-header>
        <h2 class="text-title-sm section-title">Node Detail</h2>
      </div>
      @if (node()) {
        <div class="detail-list">
          <div class="detail-item">
            <span class="detail-label text-label-caps">Label</span>
            <span class="detail-value text-label-mono">{{ node()!.label }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label text-label-caps">Type</span>
            <span class="detail-value text-label-mono">{{ node()!.type }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label text-label-caps">Method</span>
            <span class="detail-value text-label-mono">{{ node()!.method ?? 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label text-label-caps">Provenance</span>
            <span class="detail-value text-label-mono">{{ node()!.provenance ?? 'N/A' }}</span>
          </div>
        </div>
      } @else {
        <div class="empty-state text-label-mono">Select a node or row to view details.</div>
      }
    </app-rd-card>
  `,
  styles: [`
    .section-title {
      text-transform: uppercase;
    }
    .detail-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .detail-label {
      color: var(--color-on-surface-variant);
    }
    .detail-value {
      color: var(--color-on-surface);
    }
    .empty-state {
      padding: var(--space-lg);
      color: var(--color-on-surface-variant);
    }
  `],
})
export class NodeDetailPanelComponent {
  readonly node = input<TrailNode | null>(null);
}
