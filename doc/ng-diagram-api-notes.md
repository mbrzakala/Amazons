# ng-diagram API Notes

Confirmed against `ng-diagram@1.2.4` installed in this workspace.
Source: `node_modules/ng-diagram/package.json`, `ng-diagram.d.ts`, `README.md`.
Docs: https://www.ngdiagram.dev/docs

## Package identity

- **npm name**: `ng-diagram`
- **Version**: 1.2.4
- **License**: Apache-2.0
- **Peer deps**: `@angular/common >=18.0.0`, `@angular/core >=18.0.0` (compatible with this workspace's Angular 21.2)
- **GitHub**: https://github.com/synergycodes/ng-diagram

## Stylesheet import

```css
/* Global stylesheet — apps/frontend/src/styles.scss */
@import 'ng-diagram/styles.css';
```

Must be in the global stylesheet, not component-level — the library uses CSS variables that need global scope.

Additional CSS files available: `ng-diagram/primitives.css`, `ng-diagram/tokens.css`.

## Provider function

```typescript
import { provideNgDiagram } from 'ng-diagram';

@Component({
  providers: [provideNgDiagram()],
  // ...
})
```

`provideNgDiagram()` returns `Provider[]`. Registered at **component level** on the diagram-hosting component, not app-wide.

## Model initialization

```typescript
import { initializeModel } from 'ng-diagram';

const model = initializeModel({
  nodes: [{ id: '1', position: { x: 100, y: 150 }, data: { label: 'Node 1' } }],
  edges: [{ id: 'e1', source: '1', target: '2', sourcePort: 'port-right', targetPort: 'port-left', data: {} }],
});
```

`initializeModel(model?: Partial<Model>, injector?: Injector): ModelAdapter` — creates a model adapter from initial data.

## Main component

```typescript
import { NgDiagramComponent } from 'ng-diagram';

@Component({
  imports: [NgDiagramComponent],
  template: `<ng-diagram [model]="model" [nodeTemplateMap]="nodeTemplateMap" [config]="config" />`,
})
```

Selector: `ng-diagram`. Signal inputs: `model` (required), `config`, `nodeTemplateMap`, `edgeTemplateMap`, `middlewares`.

## Model service — batch updates

```typescript
import { NgDiagramModelService } from 'ng-diagram';

// Inject in component
private readonly modelService = inject(NgDiagramModelService, { optional: true });

// Batch update methods (confirmed real names)
modelService.updateNodes(nodes: Node[]);           // or (nodesFn: (nodes: Node[]) => Node[])
modelService.updateEdges(edges: Edge[]);           // or (edgesFn: (edges: Edge[]) => Edge[])
```

**Confirmed**: `updateNodes` and `updateEdges` are the real method names, matching the master plan's assumptions. Both accept either a direct array or a function callback. These are batch operations — pass the full array, not individual nodes in a loop.

Model action types include: `'addNodes'`, `'updateNode'`, `'updateNodes'`, `'deleteNodes'`, `'addEdges'`, `'updateEdge'`, `'deleteEdges'`, `'clearModel'`, and more.

## Custom node templates

```typescript
import { NgDiagramNodeTemplate } from 'ng-diagram';

@Component({
  selector: 'app-custom-node',
  template: `
    <div class="custom-node">
      <h3>{{ node().data.title }}</h3>
      <ng-diagram-port id="input" position="left" type="target" />
      <ng-diagram-port id="output" position="right" type="source" />
    </div>
  `,
})
export class CustomNodeComponent implements NgDiagramNodeTemplate {
  node = input.required<Node>();
}
```

Custom node components implement `NgDiagramNodeTemplate` interface. The node data is accessed via `input.required<Node>()`.

Template map registration:
```typescript
import { NgDiagramNodeTemplateMap } from 'ng-diagram';

readonly nodeTemplateMap = new NgDiagramNodeTemplateMap([
  ['trailNode', TrailNodeTemplateComponent],
]);
```

## Custom edge templates

```typescript
import { NgDiagramEdgeTemplate } from 'ng-diagram';

@Component({
  selector: 'app-custom-edge',
  template: `<ng-diagram-base-edge [path]="path" [markerEnd]="markerEnd" [style]="edgeStyle" />`,
})
export class CustomEdgeComponent implements NgDiagramEdgeTemplate<Data> {
  edge = input.required<Edge>();
}
```

## Orthogonal edge routing — natively supported ✅

The library supports three built-in edge routings:

```typescript
declare const BUILT_IN_EDGE_ROUTINGS: readonly ["orthogonal", "bezier", "polyline"];
```

**`orthogonal`** is the default routing and routes edges with right-angle turns — exactly what the design system requires (no curved paths).

Configuration:
```typescript
readonly config = {
  edgeRouting: {
    defaultRouting: 'orthogonal' as const,
  },
};
```

Per-edge routing override:
```typescript
{
  id: 'edge-1',
  source: 'node-a',
  target: 'node-b',
  sourcePort: 'port-right',
  targetPort: 'port-left',
  routing: 'orthogonal' as const,
  data: {},
}
```

No custom edge renderer needed — the design system's "no curves" rule is satisfied by the built-in orthogonal routing.

## Other services available

- `NgDiagramService` — main service for all diagram functionality
- `NgDiagramNodeService` — node operations
- `NgDiagramGroupsService` — group node operations
- `NgDiagramSelectionService` — selection state
- `NgDiagramViewportService` — panning/zooming
- `NgDiagramClipboardService` — copy/paste

## Mismatch with master plan assumptions

**None.** All assumptions in `doc/frontend-ui-implementation-plan.md` §3/§4 were confirmed correct:
- `provideNgDiagram()` — ✅ real name
- `NgDiagramModelService` — ✅ real name
- `updateNodes([...])` / `updateEdges([...])` — ✅ real method signatures
- Global stylesheet import — ✅ required
- Orthogonal routing — ✅ natively supported (default)
- Custom node templates — ✅ supported via `NgDiagramNodeTemplate` interface

## Usage in this project

See `apps/frontend/src/app/features/evaluation/reasoning-trail.component.ts` for the actual implementation using this API.
