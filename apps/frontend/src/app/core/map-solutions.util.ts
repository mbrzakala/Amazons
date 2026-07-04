// Pure mapping: ApiSolution → MethodColumn (frontend UI model).
// One candidate → one UI Solution (status: 'done', no progress).
// provenance = principleName (triz) or 'Ideation' (ideation).

import { ApiSolution, ApiTrizCandidate, ApiIdeationCandidate } from '../models/api-response.model';
import { MethodColumn, Solution } from '../models/solution.model';

const METHOD_NAMES: Record<string, string> = {
  triz: 'TRIZ Contradiction Matrix',
  ideation: 'Free-form Ideation',
};

export function toMethodColumn(apiSolution: ApiSolution): MethodColumn {
  const methodId = apiSolution.method;
  const methodName = METHOD_NAMES[methodId] ?? apiSolution.method;
  const candidates = apiSolution.candidates ?? [];

  return {
    methodId,
    methodName,
    status: 'done',
    reformulation: {
      improvingParameter: apiSolution.improvingParamId
        ? `#${apiSolution.improvingParamId}`
        : undefined,
      worseningParameter: apiSolution.preservingParamId
        ? `#${apiSolution.preservingParamId}`
        : undefined,
      contradictionStatement: apiSolution.advice.slice(0, 200),
    },
    solutions: candidates.map((c) => mapCandidateToSolution(c, methodId, methodName)),
  };
}

function mapCandidateToSolution(
  candidate: ApiTrizCandidate | ApiIdeationCandidate,
  methodId: string,
  methodName: string
): Solution {
  const provenance = isTrizCandidate(candidate)
    ? candidate.principleName
    : 'Ideation';

  const description = isTrizCandidate(candidate)
    ? candidate.description
    : `${candidate.mechanism} ${candidate.whyItWorks}`;

  return {
    id: candidate.id,
    title: candidate.title,
    methodId,
    methodName,
    description,
    provenance,
    status: 'done',
  };
}

function isTrizCandidate(c: ApiTrizCandidate | ApiIdeationCandidate): c is ApiTrizCandidate {
  return 'principleName' in c;
}
