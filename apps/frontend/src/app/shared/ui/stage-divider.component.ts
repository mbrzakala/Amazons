import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-stage-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="divider">
      <div class="line" [class.dashed]="dashed()" aria-hidden="true"></div>
      <span class="label" [class.italic]="dashed()">{{ label() }}</span>
    </div>
  `,
  styles: [`
    .divider {
      position: relative;
      padding: var(--space-md) 0;
      display: flex;
      justify-content: flex-start;
    }
    .line {
      position: absolute;
      inset: 0;
      height: 100%;
      border-top: 1px solid var(--color-outline-variant);
      top: 50%;
    }
    .line.dashed {
      border-top: 1px dashed var(--color-outline-variant);
    }
    .label {
      position: relative;
      background: var(--color-surface);
      padding-right: var(--space-md);
      font: var(--text-label-caps);
      letter-spacing: var(--text-label-caps-tracking);
      text-transform: uppercase;
      color: var(--color-on-surface-variant);
    }
    .label.italic {
      font-style: italic;
    }
  `],
})
export class StageDividerComponent {
  readonly label = input.required<string>();
  readonly dashed = input<boolean>(false);
}
