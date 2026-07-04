export type SolutionStatus = 'done' | 'running' | 'pending';

export interface Solution {
  id: string;
  title: string;
  methodId: string;
  methodName: string;
  description: string;
  provenance: string;
  status: SolutionStatus;
  progress?: number;
}

export interface MethodColumn {
  methodId: string;
  methodName: string;
  status: SolutionStatus;
  reformulation: {
    improvingParameter?: string;
    worseningParameter?: string;
    contradictionStatement?: string;
    hatsAnalysis?: {
      hatName: string;
      color: string;
      note: string;
      active: boolean;
    }[];
  };
  solutions: Solution[];
}
