import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-labeled-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field-group">
      <label class="text-label-caps field-label" [for]="id()">{{ label() }}</label>
      <textarea
        [id]="id()"
        class="textarea"
        [class.error]="errorMessage()"
        [placeholder]="placeholder()"
        [rows]="rows()"
        [value]="value()"
        [attr.aria-describedby]="errorMessage() ? errorId() : null"
        (input)="onInput($event)"
      ></textarea>
      @if (errorMessage()) {
        <div [id]="errorId()" class="error-msg text-label-mono" aria-live="polite" role="status">
          {{ errorMessage() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .field-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .field-label {
      color: var(--color-on-surface-variant);
    }
    .textarea {
      width: 100%;
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-default);
      padding: var(--space-md);
      font: var(--text-body-md);
      background: var(--color-surface-container-lowest);
      color: var(--color-on-surface);
      resize: vertical;
      transition: border 0.15s ease;
    }
    .textarea::placeholder {
      color: var(--color-outline-variant);
    }
    .textarea:focus-visible {
      outline: none;
      border: 2px solid var(--color-primary);
    }
    .textarea.error {
      border: 2px solid var(--color-error);
    }
    .error-msg {
      color: var(--color-error);
    }
  `],
})
export class LabeledTextareaComponent {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly value = input<string>('');
  readonly errorMessage = input<string | null>(null);
  readonly id = input<string>(`ta-${Math.random().toString(36).slice(2, 9)}`);
  readonly valueChange = output<string>();

  readonly errorId = computed(() => `${this.id()}-error`);

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }
}
