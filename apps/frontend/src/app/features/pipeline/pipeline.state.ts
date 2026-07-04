import { Injectable, signal, computed } from '@angular/core';
import { MethodColumn, Solution, SolutionStatus } from '../../models/solution.model';

@Injectable()
export class PipelineState {
  readonly methods = signal<MethodColumn[]>([
    {
      methodId: 'triz',
      methodName: 'TRIZ Contradiction Matrix',
      status: 'done',
      reformulation: {
        improvingParameter: '#14: Degree of automation',
        worseningParameter: '#36: Complexity of device',
        contradictionStatement:
          'Increasing the level of autonomous error-correction logic leads to excessive hardware overhead and system-wide latency.',
      },
      solutions: [
        {
          id: 'triz-1',
          title: 'Principle 1: Segmentation',
          methodId: 'triz',
          methodName: 'TRIZ',
          description:
            'Divide the error-correction module into independent, asynchronous nodes. This reduces central processing bottlenecks by isolating local fault handling.',
          provenance: 'Matrix Cell (14/36)',
          status: 'done',
        },
        {
          id: 'triz-2',
          title: 'Principle 10: Preliminary Action',
          methodId: 'triz',
          methodName: 'TRIZ',
          description:
            'Perform data validation prior to main processing cycles. Pre-emptive filtering removes the need for complex reactive error logic during peak execution.',
          provenance: 'Inventive Principle #10',
          status: 'done',
        },
        {
          id: 'triz-3',
          title: 'Principle 28: Mechanics Substitution',
          methodId: 'triz',
          methodName: 'TRIZ',
          description:
            'Synthesizing optical-based feedback loops to replace existing electrical signal paths...',
          provenance: 'Inventive Principle #28',
          status: 'running',
          progress: 33,
        },
      ],
    },
    {
      methodId: 'hats',
      methodName: 'Six Thinking Hats Analysis',
      status: 'running',
      reformulation: {
        hatsAnalysis: [
          { hatName: 'White Hat', color: '#ffffff', note: 'Latency is currently at 450ms. Error rate is 1.2% per 10k ops.', active: false },
          { hatName: 'Red Hat', color: '#dc2626', note: 'Fear of system failure during high-demand surges is high.', active: false },
          { hatName: 'Black Hat', color: '#000000', note: 'Complexity might lead to unmaintainable codebase long-term.', active: false },
          { hatName: 'Yellow Hat', color: '#facc15', note: 'Increased automation will significantly reduce manual QA costs.', active: false },
          { hatName: 'Green Hat', color: '#22c55e', note: 'What if we used ML to predict errors before they occur?', active: false },
          { hatName: 'Blue Hat', color: '#2563eb', note: 'Focus: Synthesis of safety and performance metrics.', active: true },
        ],
      },
      solutions: [
        {
          id: 'hats-1',
          title: 'Predictive Guardrails',
          methodId: 'hats',
          methodName: 'Hats',
          description:
            'Integrate light-weight Bayesian filters to monitor data flow trends. Addressing Green Hat concerns by predicting failure points.',
          provenance: 'Green & Blue Hats',
          status: 'done',
        },
        {
          id: 'hats-2',
          title: 'Degraded Mode Fallback',
          methodId: 'hats',
          methodName: 'Hats',
          description:
            'Implement a "Safe State" protocol that disables non-critical automation when latency hits thresholds. Alleviates Red/Black Hat risks.',
          provenance: 'Red & Black Hats',
          status: 'done',
        },
      ],
    },
  ]);

  readonly isProcessing = signal<boolean>(true);

  readonly allDone = computed(() =>
    this.methods().every((m) => m.solutions.every((s) => s.status === 'done')),
  );

  readonly methodColumns = this.methods.asReadonly();
}
