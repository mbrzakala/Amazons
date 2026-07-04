import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-rd-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card card-surface" [class.active]="active()">
      <ng-content select="[card-header]" />
      <div class="body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: var(--radius-default);
    }
    .card.active {
      border: var(--border-2-primary);
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
}
