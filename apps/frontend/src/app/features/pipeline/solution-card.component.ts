import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Solution } from '../../models/solution.model';
import { StatusChipComponent } from '../../shared/ui/status-chip.component';

@Component({
  selector: 'app-solution-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusChipComponent],
  template: `
    @if (solution().status === 'pending') {
      <div class="placeholder skeletal-x">
        <div class="placeholder-label text-label-mono">Generating Solution {{ index() + 1 }}...</div>
      </div>
    } @else {
      <div class="card" [class.running]="solution().status === 'running'">
        <div class="header">
          <h4 class="title text-title-sm" [class.italic]="solution().status === 'running'">{{ solution().title }}</h4>
          <app-status-chip [status]="solution().status" />
        </div>
        <p class="desc text-body-md" [class.italic]="solution().status === 'running'">{{ solution().description }}</p>
        @if (solution().status === 'running') {
          <div class="progress-track">
            <div class="progress-bar" [style.width.%]="solution().progress ?? 0"></div>
          </div>
        } @else {
          <div class="footer">
            <span class="provenance text-label-mono">Provenance: {{ solution().provenance }}</span>
            <span class="material-symbols-outlined arrow">arrow_forward</span>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .card {
      border: var(--border-1);
      padding: var(--space-md);
      transition: border 0.2s;
    }
    .card:hover {
      border-color: var(--color-primary);
    }
    .card:hover .arrow {
      transform: translateX(4px);
    }
    .card.running {
      border: 1px dashed var(--color-primary);
      background: var(--color-surface-container-low);
      opacity: 0.8;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-sm);
      margin-bottom: var(--space-sm);
    }
    .title {
      font-weight: 700;
    }
    .desc {
      color: var(--color-on-surface-variant);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: var(--space-md);
    }
    .footer {
      padding-top: var(--space-sm);
      border-top: var(--border-1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .provenance {
      font-size: 10px;
      text-transform: uppercase;
      color: var(--color-on-surface-variant);
    }
    .arrow {
      color: var(--color-on-surface-variant);
      transition: transform 0.2s;
    }
    .progress-track {
      height: 4px;
      background: var(--color-outline-variant);
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: var(--color-primary);
      animation: progress-slide 2s ease-in-out infinite;
    }
    .placeholder {
      height: 128px;
      border: 2px dashed var(--color-outline-variant);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-surface-container-low);
    }
    .placeholder-label {
      position: relative;
      z-index: 1;
      background: var(--color-surface-container-lowest);
      padding: var(--space-sm) var(--space-md);
      border: var(--border-1);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  `],
})
export class SolutionCardComponent {
  readonly solution = input.required<Solution>();
  readonly index = input<number>(0);
}
