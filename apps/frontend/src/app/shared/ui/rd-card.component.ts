import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-rd-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class.active]="active()" [class.interactive]="interactive()">
      <ng-content select="[card-header]" />
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
    .card.interactive {
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    .card.interactive:hover {
      border-color: var(--color-primary);
    }
    ::ng-deep [card-header] {
      padding: var(--space-md) var(--space-lg);
      border-bottom: var(--border-1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
    }
    .body {
      padding: var(--space-lg);
    }
  `],
})
export class RdCardComponent {
  readonly active = input<boolean>(false);
  readonly interactive = input<boolean>(false);
}
