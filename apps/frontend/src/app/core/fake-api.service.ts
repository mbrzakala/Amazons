import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MethodColumn } from '../models/solution.model';
import { EvaluationRow, TrailNode, TrailEdge } from '../models/evaluation.model';
import { ProblemInput } from '../models/problem.model';

interface ReformulationResponse {
  problem: ProblemInput;
  methods: MethodColumn[];
}

interface EvaluationResponse {
  rows: EvaluationRow[];
  recommendedId: string;
  trail: {
    nodes: TrailNode[];
    edges: TrailEdge[];
  };
}

@Injectable({ providedIn: 'root' })
export class FakeApiService {
  private readonly latency = 300;

  submitProblem(problem: ProblemInput): Observable<ReformulationResponse> {
    return of({
      problem,
      methods: this.getReformulations(),
    }).pipe(delay(this.latency));
  }

  getReformulations(): MethodColumn[] {
    return [
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
    ];
  }

  getEvaluation(): EvaluationRow[] {
    return [
      { id: '1', title: 'Quantum-Shift Catalysis', method: 'First Principles', feasibility: 0.85, novelty: 0.92, impact: 0.95, risk: 0.30, totalScore: 2.42, recommended: false },
      { id: '2', title: 'Synthetic Neural Scaffold', method: 'Biomimetic R&D', feasibility: 0.94, novelty: 0.98, impact: 0.99, risk: 0.12, totalScore: 2.79, recommended: true },
      { id: '3', title: 'Modular Kinetic Loop', method: 'TRIZ Analysis', feasibility: 0.70, novelty: 0.65, impact: 0.82, risk: 0.45, totalScore: 1.72, recommended: false },
      { id: '4', title: 'Passive Thermal Sink', method: 'Analogical Transfer', feasibility: 0.98, novelty: 0.42, impact: 0.55, risk: 0.05, totalScore: 1.90, recommended: false },
      { id: '5', title: 'Isomorphic Grid Redesign', method: 'SCAMPER', feasibility: 0.62, novelty: 0.78, impact: 0.74, risk: 0.55, totalScore: 1.59, recommended: false },
      { id: '6', title: 'Graphene-Pulse Array', method: 'Material Substitution', feasibility: 0.45, novelty: 0.95, impact: 0.88, risk: 0.68, totalScore: 1.60, recommended: false },
    ];
  }

  getTrailNodes(): TrailNode[] {
    return [
      { id: 'root', label: 'Problem Root', type: 'root', level: 0, position: { left: '50%', top: '0' }, isCriticalPath: true },
      { id: 'ref-a', label: 'Reformulation A', type: 'reformulation', level: 1, position: { left: 'calc(50% - 300px)', top: '154px' }, isCriticalPath: false, skeleton: true },
      { id: 'ref-b', label: 'Reformulation B', type: 'reformulation', level: 1, position: { left: '50%', top: '154px' }, isCriticalPath: false, skeleton: true },
      { id: 'ref-c', label: 'Reformulation C', type: 'reformulation', level: 1, position: { left: 'calc(50% + 300px)', top: '154px' }, isCriticalPath: false, skeleton: true },
      { id: 'cand-1', label: 'Quantum-Shift', type: 'candidate', level: 2, position: { left: 'calc(50% - 200px)', top: '308px' }, isCriticalPath: false },
      { id: 'cand-2', label: 'Neural Scaffold', type: 'candidate', level: 2, position: { left: 'calc(50% + 200px)', top: '308px' }, isCriticalPath: true },
      { id: 'final', label: 'Scaffold-A1', type: 'final', level: 3, position: { left: '50%', top: '462px' }, isCriticalPath: true },
    ];
  }

  getTrailEdges(): TrailEdge[] {
    return [
      { from: 'root', to: 'ref-a' },
      { from: 'root', to: 'ref-b' },
      { from: 'root', to: 'ref-c' },
      { from: 'ref-b', to: 'cand-1' },
      { from: 'ref-b', to: 'cand-2' },
      { from: 'cand-2', to: 'final' },
    ];
  }

  fetchEvaluation(): Observable<EvaluationResponse> {
    return of({
      rows: this.getEvaluation(),
      recommendedId: '2',
      trail: {
        nodes: this.getTrailNodes(),
        edges: this.getTrailEdges(),
      },
    }).pipe(delay(this.latency));
  }
}
