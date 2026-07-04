import { Injectable, signal } from '@angular/core';
import { EvaluationRow, TrailNode, TrailEdge } from '../../models/evaluation.model';

@Injectable()
export class EvaluationState {
  readonly rows = signal<EvaluationRow[]>([
    { id: '1', title: 'Quantum-Shift Catalysis', method: 'First Principles', feasibility: 0.85, novelty: 0.92, impact: 0.95, risk: 0.30, totalScore: 2.42, recommended: false },
    { id: '2', title: 'Synthetic Neural Scaffold', method: 'Biomimetic R&D', feasibility: 0.94, novelty: 0.98, impact: 0.99, risk: 0.12, totalScore: 2.79, recommended: true },
    { id: '3', title: 'Modular Kinetic Loop', method: 'TRIZ Analysis', feasibility: 0.70, novelty: 0.65, impact: 0.82, risk: 0.45, totalScore: 1.72, recommended: false },
    { id: '4', title: 'Passive Thermal Sink', method: 'Analogical Transfer', feasibility: 0.98, novelty: 0.42, impact: 0.55, risk: 0.05, totalScore: 1.90, recommended: false },
    { id: '5', title: 'Isomorphic Grid Redesign', method: 'SCAMPER', feasibility: 0.62, novelty: 0.78, impact: 0.74, risk: 0.55, totalScore: 1.59, recommended: false },
    { id: '6', title: 'Graphene-Pulse Array', method: 'Material Substitution', feasibility: 0.45, novelty: 0.95, impact: 0.88, risk: 0.68, totalScore: 1.60, recommended: false },
  ]);

  readonly trailNodes = signal<TrailNode[]>([
    { id: 'root', label: 'Problem Root', type: 'root', level: 0, position: { left: '50%', top: '0' }, isCriticalPath: true },
    { id: 'ref-a', label: 'Reformulation A', type: 'reformulation', level: 1, position: { left: 'calc(50% - 300px)', top: '154px' }, isCriticalPath: false, skeleton: true },
    { id: 'ref-b', label: 'Reformulation B', type: 'reformulation', level: 1, position: { left: '50%', top: '154px' }, isCriticalPath: false, skeleton: true },
    { id: 'ref-c', label: 'Reformulation C', type: 'reformulation', level: 1, position: { left: 'calc(50% + 300px)', top: '154px' }, isCriticalPath: false, skeleton: true },
    { id: 'cand-1', label: 'Quantum-Shift', type: 'candidate', level: 2, position: { left: 'calc(50% - 200px)', top: '308px' }, isCriticalPath: false },
    { id: 'cand-2', label: 'Neural Scaffold', type: 'candidate', level: 2, position: { left: 'calc(50% + 200px)', top: '308px' }, isCriticalPath: true },
    { id: 'final', label: 'Scaffold-A1', type: 'final', level: 3, position: { left: '50%', top: '462px' }, isCriticalPath: true },
  ]);

  readonly trailEdges = signal<TrailEdge[]>([
    { from: 'root', to: 'ref-a' },
    { from: 'root', to: 'ref-b' },
    { from: 'root', to: 'ref-c' },
    { from: 'ref-b', to: 'cand-1' },
    { from: 'ref-b', to: 'cand-2' },
    { from: 'cand-2', to: 'final' },
  ]);
}
