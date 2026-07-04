import { Injectable, inject, signal, computed } from '@angular/core';
import { ProblemInput } from '../models/problem.model';
import { MethodColumn, Solution } from '../models/solution.model';
import { EvaluationRow, TrailNode, TrailEdge } from '../models/evaluation.model';
import { FakeApiService } from './fake-api.service';

@Injectable()
export class SolveSessionService {
  private readonly fakeApi = inject(FakeApiService);

  readonly problem = signal<ProblemInput | null>(null);
  readonly trizReformulation = signal<MethodColumn | null>(null);
  readonly secondMethodReformulation = signal<MethodColumn | null>(null);
  readonly trizSolutions = signal<Solution[]>([]);
  readonly secondMethodSolutions = signal<Solution[]>([]);
  readonly evaluation = signal<EvaluationRow[]>([]);
  readonly recommendation = signal<EvaluationRow | null>(null);
  readonly trailNodes = signal<TrailNode[]>([]);
  readonly trailEdges = signal<TrailEdge[]>([]);

  readonly stage = signal<'problem' | 'pipeline' | 'evaluation'>('problem');

  readonly allSolutionsReady = computed(() => {
    const triz = this.trizSolutions();
    const second = this.secondMethodSolutions();
    if (triz.length === 0 || second.length === 0) return false;
    return [...triz, ...second].every((s) => s.status === 'done');
  });

  readonly recommendedRowId = computed(() => {
    const rec = this.recommendation();
    return rec?.id ?? null;
  });

  submitProblem(problem: ProblemInput): void {
    this.problem.set(problem);
    this.stage.set('pipeline');
  }

  setTrizReformulation(column: MethodColumn): void {
    this.trizReformulation.set(column);
    this.trizSolutions.set(column.solutions);
  }

  setSecondMethodReformulation(column: MethodColumn): void {
    this.secondMethodReformulation.set(column);
    this.secondMethodSolutions.set(column.solutions);
  }

  setEvaluation(rows: EvaluationRow[]): void {
    this.evaluation.set(rows);
    const rec = rows.find((r) => r.recommended) ?? null;
    this.recommendation.set(rec);
    this.stage.set('evaluation');
  }

  setTrail(nodes: TrailNode[], edges: TrailEdge[]): void {
    this.trailNodes.set(nodes);
    this.trailEdges.set(edges);
  }

  loadEvaluationData(): void {
    if (this.evaluation().length > 0) return;
    const rows = this.fakeApi.getEvaluation();
    this.setEvaluation(rows);
    this.setTrail(this.fakeApi.getTrailNodes(), this.fakeApi.getTrailEdges());
  }

  reset(): void {
    this.problem.set(null);
    this.trizReformulation.set(null);
    this.secondMethodReformulation.set(null);
    this.trizSolutions.set([]);
    this.secondMethodSolutions.set([]);
    this.evaluation.set([]);
    this.recommendation.set(null);
    this.trailNodes.set([]);
    this.trailEdges.set([]);
    this.stage.set('problem');
  }
}
