import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class ProblemInputState {
  readonly definition = signal('');
  readonly systemRequirement = signal('');
  readonly physicalLimit = signal('');

  readonly isValid = computed(
    () => this.definition().trim().length > 0,
  );

  updateDefinition(value: string): void {
    this.definition.set(value);
  }

  updateSystemRequirement(value: string): void {
    this.systemRequirement.set(value);
  }

  updatePhysicalLimit(value: string): void {
    this.physicalLimit.set(value);
  }
}
