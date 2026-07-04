import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PhaseBreadcrumbComponent, Phase } from '../../shared/ui/phase-breadcrumb.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { LabeledTextareaComponent } from '../../shared/ui/labeled-textarea.component';
import { LabeledInputComponent } from '../../shared/ui/labeled-input.component';
import { RdCardComponent } from '../../shared/ui/rd-card.component';
import { SolveSessionService } from '../../core/solve-session.service';

@Component({
  selector: 'app-problem-input-page',
  templateUrl: './problem-input-page.html',
  styleUrl: './problem-input-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseBreadcrumbComponent, ButtonComponent, LabeledTextareaComponent, LabeledInputComponent, RdCardComponent],
})
export class ProblemInputPage {
  private readonly session = inject(SolveSessionService);
  private readonly router = inject(Router);

  readonly phases: Phase[] = [
    { label: 'PHASE 01', state: 'active' },
    { label: 'REASONING', state: 'upcoming' },
    { label: 'EVALUATION', state: 'upcoming' },
  ];

  readonly definition = signal('');
  readonly improvingParameter = signal('');
  readonly worseningParameter = signal('');
  readonly definitionError = signal('');
  readonly improvingError = signal('');
  readonly worseningError = signal('');
  readonly isSubmitting = signal(false);
  readonly submitError = signal('');

  readonly isValid = computed(
    () =>
      this.definition().trim().length > 0 &&
      this.improvingParameter().trim().length > 0 &&
      this.worseningParameter().trim().length > 0,
  );

  onDefinitionChange(value: string): void {
    this.definition.set(value);
    if (this.definitionError()) this.definitionError.set('');
  }

  onImprovingParameterChange(value: string): void {
    this.improvingParameter.set(value);
    if (this.improvingError()) this.improvingError.set('');
  }

  onWorseningParameterChange(value: string): void {
    this.worseningParameter.set(value);
    if (this.worseningError()) this.worseningError.set('');
  }

  onSubmit(): void {
    let hasError = false;

    if (this.definition().trim().length === 0) {
      this.definitionError.set('Describe the inventive problem before starting.');
      hasError = true;
    } else {
      this.definitionError.set('');
    }

    if (this.improvingParameter().trim().length === 0) {
      this.improvingError.set('Specify what should improve.');
      hasError = true;
    } else {
      this.improvingError.set('');
    }

    if (this.worseningParameter().trim().length === 0) {
      this.worseningError.set('Specify what degrades as a result.');
      hasError = true;
    } else {
      this.worseningError.set('');
    }

    if (hasError) return;

    this.isSubmitting.set(true);
    this.submitError.set('');

    this.session
      .submitProblem({
        definition: this.definition().trim(),
        improvingParameter: this.improvingParameter().trim(),
        worseningParameter: this.worseningParameter().trim(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/pipeline']);
        },
        error: (err) => {
          // Surface the real transport error (CORS, network, validation, 500s)
          // in the console so a failed delivery is diagnosable, not silent.
          console.error('Problem payload submission failed:', err);
          this.isSubmitting.set(false);
          this.submitError.set('Failed to submit. Please try again.');
        },
      });
  }
}
