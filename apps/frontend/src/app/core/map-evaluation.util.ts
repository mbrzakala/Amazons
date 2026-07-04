// Pure mapping: ApiSolution[] → EvaluationRow[] (frontend UI model).
// Only candidates that have been evaluated (scores present) are included.

import { ApiSolution, ApiTrizCandidate, ApiIdeationCandidate } from '../models/api-response.model';
import { EvaluationRow } from '../models/evaluation.model';

export function toEvaluationRows(solutions: ApiSolution[]): EvaluationRow[] {
  const rows: EvaluationRow[] = [];

  for (const sol of solutions) {
    const candidates = sol.candidates ?? [];
    for (const c of candidates) {
      if (c.feasibility === undefined || c.totalScore === undefined) continue;

      rows.push({
        id: c.id,
        title: c.title,
        method: sol.method === 'triz' ? 'TRIZ' : 'Ideation',
        feasibility: c.feasibility,
        novelty: c.novelty ?? 0,
        impact: c.impact ?? 0,
        risk: c.risk ?? 0,
        totalScore: c.totalScore,
        recommended: c.recommended ?? false,
      });
    }
  }

  return rows;
}
