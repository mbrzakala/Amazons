import { Injectable } from '@angular/core';
import { Observable, of, delay, interval } from 'rxjs';
import { scan, takeWhile } from 'rxjs/operators';
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

  /**
   * Emits an updated snapshot of `columns` every 3s, flipping the next
   * 'running' solution (in column order) to 'done', then completes once
   * every solution in every column is 'done'.
   */
  simulateProgress(columns: MethodColumn[]): Observable<MethodColumn[]> {
    return interval(3000).pipe(
      scan((cols) => {
        let found = false;
        return cols.map((col) => {
          if (found) return col;
          const runningIdx = col.solutions.findIndex((s) => s.status === 'running');
          if (runningIdx === -1) return col;
          found = true;
          const newSolutions = col.solutions.map((s, i) =>
            i === runningIdx ? { ...s, status: 'done' as const, progress: 100 } : s,
          );
          return {
            ...col,
            status: newSolutions.every((s) => s.status === 'done') ? ('done' as const) : ('running' as const),
            solutions: newSolutions,
          };
        });
      }, columns),
      takeWhile((cols) => cols.some((col) => col.solutions.some((s) => s.status === 'running')), true),
    );
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
          {
            id: 'hats-3',
            title: 'Adaptive Confidence Scoring',
            methodId: 'hats',
            methodName: 'Hats',
            description:
              'Dynamically adjust automation confidence thresholds based on real-time Yellow Hat benefit analysis...',
            provenance: 'Yellow & White Hats',
            status: 'running',
            progress: 45,
          },
        ],
      },
    ];
  }

  getEvaluation(): EvaluationRow[] {
    return [
      { id: '1', title: 'Principle 1: Segmentation', method: 'TRIZ', feasibility: 0.85, novelty: 0.92, impact: 0.95, risk: 0.30, totalScore: 2.42, recommended: false },
      { id: '2', title: 'Principle 10: Preliminary Action', method: 'TRIZ', feasibility: 0.94, novelty: 0.98, impact: 0.99, risk: 0.12, totalScore: 2.79, recommended: true },
      { id: '3', title: 'Principle 28: Mechanics Substitution', method: 'TRIZ', feasibility: 0.70, novelty: 0.65, impact: 0.82, risk: 0.45, totalScore: 1.72, recommended: false },
      { id: '4', title: 'Predictive Guardrails', method: 'Hats', feasibility: 0.98, novelty: 0.42, impact: 0.55, risk: 0.05, totalScore: 1.90, recommended: false },
      { id: '5', title: 'Degraded Mode Fallback', method: 'Hats', feasibility: 0.62, novelty: 0.78, impact: 0.74, risk: 0.55, totalScore: 1.59, recommended: false },
      { id: '6', title: 'Adaptive Confidence Scoring', method: 'Hats', feasibility: 0.45, novelty: 0.95, impact: 0.88, risk: 0.68, totalScore: 1.60, recommended: false },
    ];
  }

  getTrailNodes(): TrailNode[] {
    return [
      { id: 'root', label: 'Problem Root', type: 'root', level: 0, position: { x: 400, y: 0 }, isCriticalPath: true },
      { id: 'ref-a', label: 'Reformulation A', type: 'reformulation', level: 1, position: { x: 100, y: 154 }, isCriticalPath: false, skeleton: true },
      { id: 'ref-b', label: 'Reformulation B', type: 'reformulation', level: 1, position: { x: 400, y: 154 }, isCriticalPath: false, skeleton: true },
      { id: 'ref-c', label: 'Reformulation C', type: 'reformulation', level: 1, position: { x: 700, y: 154 }, isCriticalPath: false, skeleton: true },
      { id: 'cand-1', label: 'Principle 1: Segmentation', type: 'candidate', level: 2, position: { x: 200, y: 308 }, isCriticalPath: false, method: 'TRIZ', provenance: 'Matrix Cell (14/36)' },
      { id: 'cand-2', label: 'Predictive Guardrails', type: 'candidate', level: 2, position: { x: 600, y: 308 }, isCriticalPath: true, method: 'Hats', provenance: 'Green & Blue Hats' },
      { id: 'final', label: 'Scaffold-A1', type: 'final', level: 3, position: { x: 400, y: 462 }, isCriticalPath: true },
    ];
  }

  getTrailEdges(): TrailEdge[] {
    return [
      { from: 'root', to: 'ref-a' },
      { from: 'root', to: 'ref-b' },
      { from: 'root', to: 'ref-c' },
      { from: 'ref-a', to: 'cand-1' },
      { from: 'ref-b', to: 'cand-1' },
      { from: 'ref-b', to: 'cand-2' },
      { from: 'ref-c', to: 'cand-2' },
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
