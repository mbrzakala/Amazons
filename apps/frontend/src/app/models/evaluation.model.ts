export interface EvaluationRow {
  id: string;
  title: string;
  method: string;
  feasibility: number;
  novelty: number;
  impact: number;
  risk: number;
  totalScore: number;
  recommended: boolean;
}

export interface TrailNode {
  id: string;
  label: string;
  type: 'root' | 'reformulation' | 'candidate' | 'final';
  level: number;
  position: { x: number; y: number };
  isCriticalPath: boolean;
  skeleton?: boolean;
  method?: string;
  provenance?: string;
}

export interface TrailEdge {
  from: string;
  to: string;
}
