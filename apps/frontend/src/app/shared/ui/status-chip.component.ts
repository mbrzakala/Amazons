import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SolutionStatus } from '../../models/solution.model';

@Component({
  selector: 'app-status-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="chip" [class.running]="status() === 'running'" [class.done]="status() === 'done'" [class.pending]="status() === 'pending'">
      @if (status() === 'running') {
        <span class="dot animate-pulse-dot"></span>
      }
      @if (status() === 'done') {
        <span class="material-symbols-outlined icon">check_circle</span>
      }
      {{ label() }}
    </span>
  `,
  styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: 2px var(--space-sm);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-full);
      font: var(--text-label-caps);
      letter-spacing: var(--text-label-caps-tracking);
      text-transform: uppercase;
      white-space: nowrap;
    }
    .chip.done {
      border: 1px solid var(--color-primary);
    }
    .chip.running {
      border: 1px dashed var(--color-primary);
      animation: pulse-bg 1.5s ease-in-out infinite;
    }
    .chip.pending {
      border: 1px dashed var(--color-outline);
      color: var(--color-on-surface-variant);
    }
    .dot {
      width: calc(var(--space-sm) * 0.75);
      height: calc(var(--space-sm) * 0.75);
      border-radius: var(--radius-full);
      background: var(--color-primary);
    }
    .icon {
      font-size: var(--space-sm);
    }
  `],
})
export class StatusChipComponent {
  readonly status = input.required<SolutionStatus>();
  readonly customLabel = input<string>('');
  readonly label = computed(() => {
    const custom = this.customLabel();
    if (custom) return custom;
    const s = this.status();
    return s === 'done' ? 'Done' : s === 'running' ? 'Running' : 'Pending';
  });
}
