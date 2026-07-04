import { Route } from '@angular/router';
import { SolveSessionService } from './core/solve-session.service';

export const appRoutes: Route[] = [
  {
    path: '',
    providers: [SolveSessionService],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/problem-input/problem-input-page').then(
            (m) => m.ProblemInputPage,
          ),
      },
      {
        path: 'pipeline',
        loadComponent: () =>
          import('./features/pipeline/pipeline-page').then(
            (m) => m.PipelinePage,
          ),
      },
      {
        path: 'evaluation',
        loadComponent: () =>
          import('./features/evaluation/evaluation-page').then(
            (m) => m.EvaluationPage,
          ),
      },
    ],
  },
];
