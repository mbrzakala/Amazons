import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ProblemInput } from '../models/problem.model';
import { MethodColumn, Solution } from '../models/solution.model';
import { EvaluationRow, TrailNode, TrailEdge } from '../models/evaluation.model';
import { SolveResponse } from '../models/api-response.model';
import { toMethodColumn } from './map-solutions.util';
import { toEvaluationRows } from './map-evaluation.util';
import { buildTrailGraph } from './build-trail-graph.util';

@Injectable()
export class SolveSessionService {
  private readonly http = inject(HttpClient);

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

  submitProblem(problem: ProblemInput): Observable<SolveResponse> {
    return this.http
      .post<SolveResponse>('/solve', {
        problemDescription: problem.definition,
        improvingParameter: problem.improvingParameter,
        worseningParameter: problem.worseningParameter,
      })
      .pipe(
        tap((response) => {
          this.problem.set(problem);
          this.stage.set('pipeline');

          // Map the real backend response into session signals using pure mappers.
          const trizSolution = response.solutions.find((s) => s.method === 'triz');
          const ideationSolution = response.solutions.find((s) => s.method === 'ideation');

          // Set method columns and solutions.
          if (trizSolution) {
            const col = toMethodColumn(trizSolution);
            this.trizReformulation.set(col);
            this.trizSolutions.set(col.solutions);
          }
          if (ideationSolution) {
            const col = toMethodColumn(ideationSolution);
            this.secondMethodReformulation.set(col);
            this.secondMethodSolutions.set(col.solutions);
          }

          // Set evaluation and trail if evaluation succeeded.
          const evalRows = toEvaluationRows(response.solutions);
          if (evalRows.length > 0) {
            this.evaluation.set(evalRows);
            const rec = evalRows.find((r) => r.recommended) ?? null;
            this.recommendation.set(rec);
          }

          const recommendedId = response.evaluation?.recommendedCandidateId ?? null;
          const { nodes, edges } = buildTrailGraph(response, response.solutions, recommendedId);
          this.trailNodes.set(nodes);
          this.trailEdges.set(edges);
        }),
      );
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
    // Evaluation data is now set by submitProblem() from the real API response.
    // This method is kept for backward compatibility (e.g. direct navigation to
    // /evaluation) but no longer falls back to fake data.
    if (this.evaluation().length > 0) return;
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
