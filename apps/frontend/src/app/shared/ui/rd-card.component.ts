import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-rd-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class.active]="active()">
      @if (title()) {
        <div class="header">
          <h4 class="title text-title-sm">{{ title() }}</h4>
          @if (subtitle()) {
            <span class="subtitle text-label-mono">{{ subtitle() }}</span>
          }
        </div>
      }
      <div class="body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: var(--border-1);
      border-radius: var(--radius-default);
      background: var(--color-surface-container-lowest);
    }
    .card.active {
      border: var(--border-2-primary);
    }
    .header {
      padding: var(--space-md) var(--space-lg);
      border-bottom: var(--border-1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
    }
    .title {
      font-weight: 700;
    }
    .subtitle {
      color: var(--color-on-surface-variant);
      font-size: 10px;
      text-transform: uppercase;
    }
    .body {
      padding: var(--space-lg);
    }
  `],
})
export class RdCardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly active = input<boolean>(false);
}
