# Chunk 11 — ConfigProvider, Interceptor & Fake Data Layer

## Depends on
Chunk 09 (app config/bootstrap wiring point exists).

## Context recap
No `apps/backend` project exists yet in this workspace. Rather than hardcoding fetch calls or leaving the frontend with nothing to call, build the real contract shape now against a fake/in-memory data source, switchable later per feature — not a global hardcoded flag — to a real NestJS API. This is not throwaway scaffolding: if the real backend isn't ready by demo day, this fake layer is what gets shown live, so give it realistic content (mirror the wireframe's own example text — e.g. TRIZ parameters "#14: Degree of automation" / "#36: Complexity of device", Six Hats example notes — don't use lorem ipsum).

## Task
1. Build a `ConfigProvider` (`apps/frontend/src/app/core/config.provider.ts` or similar) exposing `fakeApiUrl()` and `apiUrl()` — for now `apiUrl()` can point at a not-yet-real address, that's fine, it's unused until a backend exists.
2. Build an `HttpInterceptor` that, per feature/request, decides fake vs. real base URL from the `ConfigProvider` (a simple per-feature boolean/flag map is enough — document the mechanism in a code comment).
3. Build a fake data service (`apps/frontend/src/app/core/fake-data.service.ts`) returning realistic, contract-shaped payloads matching:
   ```
   {
     problem: string,
     reformulations: { triz: {...}, secondMethod: {...} },
     solutions: [{ id, method, title, description, sourcePrinciple }],  // >= 6
     evaluation: {
       scores: [{ solutionId, criteria: {feasibility, novelty, impact, risk}, total }],
       recommendedSolutionId: string,
       recommendedMethod: "triz" | "secondMethod",
       reasoningTrail: { nodes: [...], edges: [...] }
     }
   }
   ```
   using the wireframes' own example content for the TRIZ and evaluation-table rows (Quantum-Shift Catalysis, Synthetic Neural Scaffold, etc. from `wireframe_evaluation_ngd_trail/code.html` are good source material — reuse them as the fake dataset rather than inventing new placeholder names).
4. Simulate realistic async timing (e.g., staggered `setTimeout`/`delay()` per solution) so Screen B's "running → done" states are demonstrable, not instantaneous.

## Files to create/modify
- `apps/frontend/src/app/core/config.provider.ts` (new)
- `apps/frontend/src/app/core/fake-api.interceptor.ts` (new)
- `apps/frontend/src/app/core/fake-data.service.ts` (new)
- `apps/frontend/src/app/app.config.ts` (register interceptor/provider)

## Out of scope
- Do not build any UI component here.
- Do not attempt to stand up a real backend — that's explicitly out of scope for the whole frontend plan.

## Definition of done
- [ ] Calling the fake data service returns a payload matching the exact shape above, with realistic (not lorem-ipsum) content.
- [ ] Async staggering is observable (not everything resolves in the same tick).
- [ ] The interceptor's fake-vs-real switch mechanism is per-feature, documented in a comment, not a single global constant with no way back.

## Handoff
Chunk 14 (Screen B) and chunk 17 (Screen C) call this fake data service through `SolveSessionService` to populate reformulations, solutions, and evaluation — this is the only data source until a real backend exists.
