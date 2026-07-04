export interface ProblemInput {
  definition: string;
  systemRequirement: string;
  physicalLimit: string;
}

export interface Contradiction {
  improvingParameter: string;
  worseningParameter: string;
  statement: string;
}

export interface Reformulation {
  methodId: string;
  methodName: string;
  contradiction: Contradiction;
  hatsAnalysis?: HatAnalysis[];
}

export interface HatAnalysis {
  hatName: string;
  color: string;
  note: string;
  active: boolean;
}
