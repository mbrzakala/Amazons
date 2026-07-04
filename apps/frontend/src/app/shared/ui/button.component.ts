import { Component, ChangeDetectionStrategy, input, output, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="btn"
      [class.primary]="variant() === 'primary'"
      [class.secondary]="variant() === 'secondary'"
      [disabled]="disabled()"
      (click)="onClick($event)"
    >
      <ng-content select="[leading-icon]" />
      <span class="label"><ng-content /></span>
      <ng-content select="[trailing-icon]" />
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-xl);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, background 0.2s;
      border: none;
    }

    .btn.primary {
      background: var(--color-primary);
      color: var(--color-on-primary);
    }
    .btn.primary:hover:not(:disabled) {
      opacity: 0.85;
    }
    .btn.primary:active:not(:disabled) {
      opacity: 0.75;
    }

    .btn.secondary {
      background: var(--color-surface-container-lowest);
      color: var(--color-on-surface);
      border: var(--border-2-primary);
    }
    .btn.secondary:hover:not(:disabled) {
      background: var(--color-surface-container);
    }
    .btn.secondary:active:not(:disabled) {
      background: var(--color-surface-container-high);
    }

    .btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn:focus-visible {
      outline: var(--border-2-primary);
      outline-offset: 2px;
    }

    .label {
      display: inline-flex;
      align-items: center;
    }
  `],
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly buttonClick = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.buttonClick.emit(event);
    }
  }
}
