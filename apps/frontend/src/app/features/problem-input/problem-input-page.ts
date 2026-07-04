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
  readonly errorMessage = signal('');

  readonly isValid = computed(() => this.definition().trim().length > 0);

  onDefinitionChange(value: string): void {
    this.definition.set(value);
    if (this.errorMessage()) this.errorMessage.set('');
  }

  onImprovingParameterChange(value: string): void {
    this.improvingParameter.set(value);
  }

  onWorseningParameterChange(value: string): void {
    this.worseningParameter.set(value);
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage.set('Describe the inventive problem before starting.');
      return;
    }
    this.errorMessage.set('');
    this.session.submitProblem({
      definition: this.definition().trim(),
      improvingParameter: this.improvingParameter().trim(),
      worseningParameter: this.worseningParameter().trim(),
    });
    this.router.navigate(['/pipeline']);
  }
}
