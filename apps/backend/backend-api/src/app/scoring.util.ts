// Deterministic scoring and selection — never delegated to the LLM.
// The LLM scores each candidate (subjective judgment); this module
// computes totalScore and picks the winner. The model never grades
// its own work and picks the winner in the same breath.

import { CandidateScore } from './adk-agent.service';

export interface ScoredCandidate {
  candidateIndex: number;
  feasibility: number;
  novelty: number;
  impact: number;
  risk: number;
  totalScore: number;
}

// totalScore = feasibility + novelty + impact − risk
// This is the exact formula reverse-engineered from the frontend's
// fake data (verified: 0.94+0.98+0.99−0.12=2.79 ✓ for all 6 rows).
export function computeTotalScore(score: CandidateScore): number {
  return (
    score.feasibility +
    score.novelty +
    score.impact -
    score.risk
  );
}

// Returns the candidateIndex of the highest-scoring candidate, or null
// if the scores array is empty. Ties are broken by first occurrence.
export function selectRecommended(scores: ScoredCandidate[]): number | null {
  if (scores.length === 0) return null;
  let best = scores[0];
  for (const s of scores) {
    if (s.totalScore > best.totalScore) {
      best = s;
    }
  }
  return best.candidateIndex;
}

// Maps raw CandidateScore[] to ScoredCandidate[] with computed totalScore.
export function scoreCandidates(scores: CandidateScore[]): ScoredCandidate[] {
  return scores.map((s) => ({
    candidateIndex: s.candidateIndex,
    feasibility: s.feasibility,
    novelty: s.novelty,
    impact: s.impact,
    risk: s.risk,
    totalScore: computeTotalScore(s),
  }));
}
