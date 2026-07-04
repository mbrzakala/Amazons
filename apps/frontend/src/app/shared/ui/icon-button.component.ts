import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="icon-btn"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      (click)="click.emit($event)"
    >
      <span class="material-symbols-outlined" aria-hidden="true">{{ icon() }}</span>
    </button>
  `,
  styles: [`
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-sm);
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--radius-full);
      color: var(--color-on-surface-variant);
      transition: background 0.2s;
    }
    .icon-btn:hover {
      background: var(--color-surface-container-high);
    }
    .icon-btn:focus-visible {
      outline: var(--border-2-primary);
      outline-offset: -2px;
    }
    .icon-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
})
export class IconButtonComponent {
  readonly icon = input<string>('');
  readonly ariaLabel = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly click = output<MouseEvent>();
}
