// Pure mapping: (problem, solutions, evaluation) → { nodes, edges } for ng-diagram.
// Reuses the existing 4 node types: root, reformulation, candidate, final.
// Zero component/template changes — only a new pure mapping function.
//
// Trail structure:
//   root (the problem)
//     → reformulation (one per method)
//       → candidate (one per parsed candidate)
//         → final (the recommended candidate)
//
// Ideation reformulation uses problem.description verbatim (simpler and more
// robust than parsing a "restatement" back out of the agent's combined response blob).

import { ApiProblem, ApiSolution, ApiTrizCandidate, ApiIdeationCandidate } from '../models/api-response.model';
import { TrailNode, TrailEdge } from '../models/evaluation.model';

const METHOD_NAMES: Record<string, string> = {
  triz: 'TRIZ Contradiction Matrix',
  ideation: 'Free-form Ideation',
};

export function buildTrailGraph(
  problem: ApiProblem,
  solutions: ApiSolution[],
  recommendedCandidateId: string | null
): { nodes: TrailNode[]; edges: TrailEdge[] } {
  const nodes: TrailNode[] = [];
  const edges: TrailEdge[] = [];

  // Root node — the problem.
  nodes.push({
    id: 'root',
    label: problem.description.slice(0, 60),
    type: 'root',
    level: 0,
    position: { x: 400, y: 0 },
    isCriticalPath: true,
  });

  // Reformulation nodes — one per method.
  const reformulationSpacing = 300;
  const reformulationStartX = 250;

  solutions.forEach((sol, solIdx) => {
    const refId = `ref-${sol.method}`;
    const isCritical =
      recommendedCandidateId !== null &&
      (sol.candidates ?? []).some((c) => c.id === recommendedCandidateId);

    nodes.push({
      id: refId,
      label: METHOD_NAMES[sol.method] ?? sol.method,
      type: 'reformulation',
      level: 1,
      position: {
        x: reformulationStartX + solIdx * reformulationSpacing,
        y: 154,
      },
      isCriticalPath: isCritical,
      method: sol.method,
    });

    edges.push({ from: 'root', to: refId });

    // Candidate nodes — under their method's reformulation.
    const candidates = sol.candidates ?? [];
    const candidateSpacing = 180;
    const candidateStartX =
      reformulationStartX + solIdx * reformulationSpacing - 90;

    candidates.forEach((c, candIdx) => {
      const candNodeId = `cand-${c.id}`;
      const isRecommended = c.id === recommendedCandidateId;

      nodes.push({
        id: candNodeId,
        label: c.title,
        type: 'candidate',
        level: 2,
        position: {
          x: candidateStartX + candIdx * candidateSpacing,
          y: 308,
        },
        isCriticalPath: isRecommended,
        method: sol.method,
        provenance: getCandidateProvenance(c),
      });

      edges.push({ from: refId, to: candNodeId });
    });
  });

  // Final node — the recommended candidate.
  if (recommendedCandidateId) {
    const recommendedNode = nodes.find(
      (n) => n.id === `cand-${recommendedCandidateId}`
    );

    nodes.push({
      id: 'final',
      label: recommendedNode?.label ?? 'Recommended Solution',
      type: 'final',
      level: 3,
      position: { x: 400, y: 462 },
      isCriticalPath: true,
    });

    edges.push({ from: `cand-${recommendedCandidateId}`, to: 'final' });
  }

  return { nodes, edges };
}

function getCandidateProvenance(
  candidate: ApiTrizCandidate | ApiIdeationCandidate
): string {
  if ('principleName' in candidate) {
    return candidate.principleName;
  }
  return candidate.mechanism;
}
