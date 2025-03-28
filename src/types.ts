export interface SubPhase {
  sub_phase: string;
  description: string;
  code: string[];
}

export interface Phase {
  phase: string;
  description: string;
  code: string[];
  sub_phases?: SubPhase[];
}

export interface ProcessFlow {
  phases: Phase[];
}