---
stage: 4-backend
task: 2
---

# 2. API Contract: Swagger, Validation, CORS

**What to do:** Make the API self-documenting and safe to call from the frontend: Swagger docs, global request validation, and scoped CORS.

**How:**
1. In `main.ts`, build a Swagger document with `DocumentBuilder` and mount it at the same path as the global prefix (`app.setGlobalPrefix('api')` + `SwaggerModule.setup('api', ...)`), so every route is `/api/<feature>`.
2. Add `app.useGlobalPipes(new ValidationPipe())` — without this, the `class-validator` decorators on every DTO are silently inert.
3. Scope CORS to the actual frontend origin (`http://localhost:4200`) with `credentials: true` — not allow-all.
4. Decorate every controller method with `@ApiOperation`, `@ApiResponse`, and `@ApiParam`/`@ApiBody`/`@ApiQuery` as needed, and throw the correct HTTP exception (e.g. `NotFoundException` for a missing id) instead of returning `null`/`undefined` silently.

**Recommended tool:** Write directly in `main.ts` and each controller, following the confirmed working setup in `nan-stack`'s `apps/api/src/main.ts` and `user.controller.ts`. Reference: `nestJS/06-http-status-codes.md`, `07-cors.md`, `08-swagger-openapi.md`.

## Gate

- [ ] Swagger UI loads at `/api` and lists every endpoint with a summary.
- [ ] A request with an invalid DTO field is rejected (proves the global `ValidationPipe` is active).
- [ ] CORS is scoped to the real frontend origin, not `*`.
- [ ] Every "not found" case throws `NotFoundException` (404), not a silent `null`/`200`.

Next: [[3-docker-sequelize-postgres]].

## Result

**Scope:** Wire global validation, Swagger docs, and scoped CORS into the API so it is self-documenting and rejects bad input by default.

**DoD:**
- [ ] Swagger UI is reachable and documents every route added in step 1.
- [ ] Global `ValidationPipe` is active and verified with one deliberately invalid request.
- [ ] CORS only allows the frontend's real origin.

**Layers:** backend: API bootstrap, validation, docs.
