# Frontend-Backend Contract — Decision Log

Satisfies: `agent_doc/4-backend/4-frontend-backend-contract.md`

## Architecture

### ConfigProvider (per-feature API switching)

**File**: `apps/frontend/src/app/core/config.provider.ts`

The `ConfigProvider` is `@Injectable({ providedIn: 'root' })` and provides:

- `fakeApiUrl()` — returns the fake API base URL (`http://localhost:3000/fake-api`)
- `apiUrl()` — returns the resolved API URL for the default scope (fake or real)
- `apiUrlForFeature(feature)` — returns the API URL for a specific feature scope, checking per-feature overrides first
- `isFakeApi()` / `isFakeApiForFeature(feature)` — boolean checks

**Per-feature switching**: The `ApiConfig` interface supports `featureOverrides?: Partial<Record<FeatureScope, boolean>>`, where `FeatureScope = 'default' | 'problem' | 'pipeline' | 'evaluation'`. This allows individual features to switch to the real API independently — e.g., `evaluation` can use the real NestJS backend while `problem` and `pipeline` still use the fake API during incremental migration.

**Configuration injection**: `API_CONFIG` is an `InjectionToken<ApiConfig>` provided in `app.config.ts` with `DEFAULT_API_CONFIG` (fake API enabled, real URL = `http://localhost:3000/api`). To switch to the real backend, change the config value — no code changes needed.

### HTTP Interceptor

**File**: `apps/frontend/src/app/core/api.interceptor.ts`

A functional interceptor (`HttpInterceptorFn`) that:
1. Injects `ConfigProvider`
2. Reads the resolved base URL via `config.apiUrl()`
3. Prepends the base URL to any request URL that doesn't already start with `http`
4. Passes the request through

Registered in `app.config.ts` via `provideHttpClient(withInterceptors([apiInterceptor]))`.

### Fake API Service

**File**: `apps/frontend/src/app/core/fake-api.service.ts`

`@Injectable({ providedIn: 'root' })` returning contract-shaped payloads:

- `submitProblem(problem)` → `Observable<ReformulationResponse>` — simulates POST, returns problem + reformulated methods
- `getReformulations()` → `MethodColumn[]` — synchronous access for pre-loaded data
- `getEvaluation()` → `EvaluationRow[]` — synchronous access
- `getTrailNodes()` / `getTrailEdges()` → `TrailNode[]` / `TrailEdge[]` — synchronous access
- `fetchEvaluation()` → `Observable<EvaluationResponse>` — simulates GET, returns evaluation rows + recommended ID + trail graph in one response

All async methods include simulated 300ms latency via `rxjs/delay` to exercise loading states.

## Decision: Fake API as Demo Data Source

**Date**: 2026-07-04
**Status**: EXPLICIT DECISION — not an implicit stopgap

As of this date, `apps/backend` does not exist in the workspace. The fake API layer is therefore not a temporary development stub — it is the **primary data source for the live demo**.

This decision is made with the following rationale:

1. **The hackathon requires a working, deployed application** (Day 5 deliverable: "Link to the deployed, working application"). If the backend is not ready, the fake API must be good enough to serve as the shipped data layer.

2. **The fake data is contract-shaped**, not throwaway stub data. The `ReformulationResponse` and `EvaluationResponse` interfaces mirror what the real NestJS API will return. When the backend lands, the swap is config-only: flip `useFakeApi: false` in `API_CONFIG`, and the interceptor routes to the real URL.

3. **Per-feature migration is supported**. If the backend implements the evaluation endpoint first, `featureOverrides: { evaluation: false }` switches only that feature to the real API while the others remain on fake data. This enables incremental backend development without frontend changes.

4. **The fake data quality is demo-grade**: realistic TRIZ parameters (#14/#36 contradiction), Six Thinking Hats analysis with all 6 hats, 6 evaluation candidates with feasibility/novelty/impact/risk scores, and a 7-node reasoning trail with critical-path highlighting. This is sufficient for the pitch demo.

**Risk**: If the backend is never built, the fake API is the shipped product. This is acceptable for the hackathon context. For production, the real backend must implement the same response shapes defined in `ReformulationResponse` and `EvaluationResponse`.

## API Contract Shapes

### POST /problem (submit problem)

Request:
```typescript
{ definition: string; systemRequirement: string; physicalLimit: string }
```

Response (`ReformulationResponse`):
```typescript
{
  problem: ProblemInput;
  methods: MethodColumn[];  // 2+ methods, each with reformulation + solutions[]
}
```

### GET /evaluation (fetch evaluation + trail)

Response (`EvaluationResponse`):
```typescript
{
  rows: EvaluationRow[];      // 6 candidates with scores
  recommendedId: string;      // ID of the recommended row
  trail: {
    nodes: TrailNode[];       // Problem root → reformulations → candidates → final
    edges: TrailEdge[];       // Orthogonal connections
  };
}
```

### Future endpoints (not yet implemented)

- `GET /methods` — list available reasoning methods
- `POST /solutions/:id/generate` — trigger solution generation for a specific method
- `GET /solutions/:id/status` — poll solution generation status
