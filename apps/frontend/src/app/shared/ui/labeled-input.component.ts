import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-labeled-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field-group">
      <label class="text-label-caps field-label" [for]="id()">{{ label() }}</label>
      <input
        [id]="id()"
        type="text"
        class="text-input"
        [class.error]="errorMessage()"
        [placeholder]="placeholder()"
        [value]="value()"
        [attr.aria-describedby]="errorMessage() ? errorId() : null"
        (input)="onInput($event)"
      />
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
    .text-input {
      width: 100%;
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-default);
      padding: var(--space-md);
      font: var(--text-body-md);
      background: var(--color-surface-container-lowest);
      color: var(--color-on-surface);
      transition: border 0.15s ease;
    }
    .text-input::placeholder {
      color: var(--color-outline-variant);
    }
    .text-input:focus-visible {
      outline: none;
      border: 2px solid var(--color-primary);
    }
    .text-input.error {
      border: 2px solid var(--color-error);
    }
    .error-msg {
      color: var(--color-error);
    }
  `],
})
export class LabeledInputComponent {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly value = input<string>('');
  readonly errorMessage = input<string | null>(null);
  readonly id = input<string>(`inp-${Math.random().toString(36).slice(2, 9)}`);
  readonly valueChange = output<string>();

  readonly errorId = computed(() => `${this.id()}-error`);

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
