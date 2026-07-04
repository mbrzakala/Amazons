---
stage: 4-backend
step: 2
source: Hackathon Wiki/stages/4-backend/steps/2-api-contract-swagger-cors-validation.md
---

# Validator — 2. API Contract: Swagger, Validation, CORS

Checks: `Hackathon Wiki/stages/4-backend/steps/2-api-contract-swagger-cors-validation.md`.

## What this step is proving

The API is self-documenting via Swagger, globally validates requests (DTOs actually
reject bad input, not just decorate it), scopes CORS to the real frontend origin, and
returns proper HTTP error codes instead of silent nulls.

## Evidence to gather

- `main.ts`: `DocumentBuilder`/`SwaggerModule.setup`, `app.setGlobalPrefix`,
  `app.useGlobalPipes(new ValidationPipe())`, CORS config.
- A live request to the Swagger UI at `/api`.
- A deliberately invalid request (bad DTO field) and its response.
- Controller source, checked for `@ApiOperation`/`@ApiResponse`/etc. decorators and use
  of `NotFoundException` vs. returning `null`/`undefined`.

## Gate checklist

1. **Swagger UI loads at `/api` and lists every endpoint with a summary.**
   Evidence: live check of the Swagger UI.
2. **A request with an invalid DTO field is rejected** (proves the global
   `ValidationPipe` is active).
   Evidence: the deliberate invalid request and its rejection response.
3. **CORS is scoped to the real frontend origin, not `*`.**
   Evidence: CORS config in `main.ts`.
4. **Every "not found" case throws `NotFoundException` (404), not a silent
   `null`/`200`.**
   Evidence: a request for a nonexistent id and its response code.

Corresponding Result/DoD (once filled): Swagger documents every route from step 1;
global `ValidationPipe` verified with one deliberately invalid request; CORS only
allows the frontend's real origin.

See `agent_doc/README.md` for the verdict scale and reporting format.
