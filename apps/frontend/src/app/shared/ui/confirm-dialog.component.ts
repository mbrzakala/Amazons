import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    @if (open()) {
      <div
        class="overlay"
        role="button"
        tabindex="0"
        aria-label="Close dialog"
        (click)="onOverlayClick()"
        (keydown.enter)="onOverlayClick()"
        (keydown.escape)="onOverlayClick()"
      >
        <div
          class="dialog card-surface"
          role="alertdialog"
          aria-modal="true"
          [attr.aria-labelledby]="'dialog-title-' + id()"
          [attr.aria-describedby]="'dialog-message-' + id()"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown.escape)="onOverlayClick()"
        >
          <h3 class="text-title-sm dialog-title" [id]="'dialog-title-' + id()">{{ title() }}</h3>
          <p class="text-body-md dialog-message" [id]="'dialog-message-' + id()">{{ message() }}</p>
          <div class="dialog-actions">
            <app-button variant="secondary" (buttonClick)="onCancel()">
              <span class="text-label-mono">{{ cancelLabel() }}</span>
            </app-button>
            <app-button variant="primary" (buttonClick)="onConfirm()">
              <span class="text-label-mono">{{ confirmLabel() }}</span>
            </app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
    }
    .dialog {
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      max-width: 400px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .dialog-title {
      font-weight: 700;
      color: var(--color-primary);
    }
    .dialog-message {
      color: var(--color-on-surface-variant);
      line-height: 1.6;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      margin-top: var(--space-sm);
    }
  `],
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirm');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly id = input('dialog');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onOverlayClick(): void {
    this.cancelled.emit();
  }
}
