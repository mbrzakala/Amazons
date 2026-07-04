// Backend API response types — mirroring the actual shapes returned by the NestJS API.
// These are the types the frontend maps FROM into its own UI models.

// TRIZ candidate shape (stored in Solution.candidates JSON array)
export interface ApiTrizCandidate {
  id: string;
  title: string;
  principleId: string;
  principleName: string;
  description: string;
  // Evaluation fields (present after evaluation step, absent if evaluation failed)
  feasibility?: number;
  novelty?: number;
  impact?: number;
  risk?: number;
  totalScore?: number;
  recommended?: boolean;
}

// Ideation candidate shape (stored in Solution.candidates JSON array)
export interface ApiIdeationCandidate {
  id: string;
  title: string;
  mechanism: string;
  whyItWorks: string;
  tradeoffs: string;
  // Evaluation fields (present after evaluation step, absent if evaluation failed)
  feasibility?: number;
  novelty?: number;
  impact?: number;
  risk?: number;
  totalScore?: number;
  recommended?: boolean;
}

export type ApiCandidate = ApiTrizCandidate | ApiIdeationCandidate;

export interface ApiSolution {
  id: string;
  problemId: string;
  method: string;
  advice: string;
  reasoningTrail: unknown;
  rawEvents: unknown;
  improvingParamId: number | null;
  preservingParamId: number | null;
  improvingParamName: string | null;
  preservingParamName: string | null;
  principles: unknown;
  rating: number | null;
  createdAt: string;
  candidates: ApiCandidate[] | null;
}

export interface ApiProblem {
  id: string;
  description: string;
  improvingParameter: string;
  worseningParameter: string;
  createdAt: string;
  solutions: ApiSolution[];
}

export interface SolveResponse extends ApiProblem {
  evaluation: { recommendedCandidateId: string | null } | null;
}
