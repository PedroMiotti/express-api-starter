# API developer guide

For day-to-day work on this codebase. Infra behavior and patterns: [.cursor/api-architecture.md](../api-architecture.md).

## Mental model

- **HTTP** is wired in `src/modules/*/*.controller.ts`. Each controller extends `BaseController`, owns an Express `router`, and calls use cases.
- **Business flow** is `controller → use case → repository (interface) → Prisma implementation`.
- **Cross-cutting** lives in `src/infra` (server, middleware, config, DB client, **request logging**, **graceful shutdown**) and `src/shared` (`Result`, **RFC7807-style errors**, **Pino** logger, settings, reusable schemas/types).

Final URL shape: `http(s)://{host}:{port}{AppSettings.ServerRoot}{route}` (e.g. server root `/api` + controller path `/sample` → `/api/sample`).

## Trace a request

1. Global stack in `App.ts`: `helmet` → **`pino-http`** (`requestLogger`, sets `req.log` / `x-request-id`) → JSON body → **CORS** (whitelist from `ORIGINS` / `AppSettings.ServerOrigins`).
2. Find the route string in a controller’s `initializeRoutes()` (e.g. `this.router.get(\`/${this.baseUrl}\`, ...)`).
3. Follow the handler to the imported use case from `./useCases`.
4. Open `useCases/index.ts` in that module to see how the use case is constructed (repository singleton, optional shared services).
5. Repository interface is under `repository/I*Repository.ts`; Prisma code under `repository/prisma/*.repository.ts` using `prisma` from `@/infra/database/prisma`.

**Infra-only routes:** `Health` module registers `GET /health/live` and `GET /health/ready` under the same `ServerRoot` (e.g. `/api/health/live`).

## Controllers

- **Constructor**: `super('<Name>')` for logging/monitoring; set `baseUrl`, call `initializeRoutes()`.
- **Export**: `export default new XxxController()` (singleton).
- **Handlers**: `try { ... this.handleResult(res, await useCase.execute(...)); } catch (e) { next(e); }` so errors reach the global error middleware (`ApplicationError` and unknowns).
- **Registration**: add the default export to the `controllers` array in [src/modules/index.ts](../../src/modules/index.ts).

### Auth

- Protected routes use `TokenClaims` from `@/infra/middleware/authorization` in the route middleware array.
- **`JWT_SECRET`** must be set; tokens are **verified** with `jsonwebtoken` (not decode-only).
- After `TokenClaims`, `req.claims` is populated (see [src/shared/types/tokenPayload.ts](../../src/shared/types/tokenPayload.ts) and Express augmentation in [src/shared/types/express.d.ts](../../src/shared/types/express.d.ts)).
- Send `Authorization: Bearer <jwt>`.

### Validation

- Define Zod schemas under the module’s `schemas/` (often `body` / `query` / `params` / `file` keys to match [validate middleware](../../src/infra/middleware/validation/zod/index.ts)).
- On validation failure the middleware calls `next(new ValidationError(...))` — response body is **`application/problem+json`** from the global handler, not a `Result`.
- Wrap routes: `[TokenClaims, validate(yourSchema)]` (order can vary; keep consistent with the team).
- Type handlers with `TypedRequest<typeof yourSchema>` from `@/shared/http/TypedRequest` for `body` / `params` / `query` inference (`claims` intersected for auth routes).

### Public vs authenticated routes

Some modules expose `Public*` controllers with routes that omit `TokenClaims`. Prefer the smallest surface area for unauthenticated APIs.

## Use cases

- One folder per use case under `useCases/<Action>/index.ts`, exported class `XxxUseCase` with `execute(...)`.
- Return `IResult<T>` via `Result<T>` from `@/shared/http/Result`: `setData`, `setMessage`, `setError`, `setStatusCode` as needed.
- Dependencies come through the constructor; wire them in `useCases/index.ts` (manual DI, no framework).

## Repositories

- **Interface** in `repository/I<Module>Repository.ts` — what the use case depends on.
- **Implementation** in `repository/prisma/<Module>.repository.ts` — uses `prisma` from `@/infra/database/prisma`, maps DB rows to DTOs.
- Default export a singleton from the Prisma repository file and pass it into use cases from `useCases/index.ts`.

## DTOs and errors (two response shapes)

- **Success path (normal JSON API envelope):** `Result` + `BaseController.handleResult` → `result.toResultDto()` JSON (not RFC7807).
- **Failure path (`next(error)`):** global handler → **`application/problem+json`** with `type`, `title`, `status`, `detail`, `code`, `instance`, optional `errors`, `requestId`.
- Throw **`ApplicationError`** with the **object constructor** (`title`, `detail`, `status`, `code`, optional `type`, …) from `@/shared/error/ApplicationError`.
- **`RepositoryError`** extends `ApplicationError` for data-layer failures; map or wrap at boundaries as needed.

See also [ERROR_HANDLING_GUIDE.md](../../ERROR_HANDLING_GUIDE.md) at repo root.

## Shared providers and services

- **Providers** (`src/shared/providers/*`): SDKs and infrastructure adapters (storage, queues, monitoring, crypto). Use when the capability is not “this module’s DB”.
- **Services** (`src/shared/services/*`): HTTP clients to other internal APIs, orchestration, shared integration logic. Inject into use cases like repositories.

Do not call vendor SDKs or raw axios from controllers; keep that behind interfaces and module `useCases`.

## Prisma

- Client: [src/infra/database/prisma.ts](../../src/infra/database/prisma.ts) — requires **`DATABASE_URL`**, uses `@prisma/adapter-pg`.
- Schema and migrations live under `prisma/`. After schema changes: generate client and migrate per team process.

## Config and local run

- Environment loading: [src/infra/config/index.ts](../../src/infra/config/index.ts).
- Typed settings after boot: [src/shared/settings/AppSettings.ts](../../src/shared/settings/AppSettings.ts) (`initAppSettings` runs from `App`).

Useful scripts (this repo uses **pnpm**):

- `pnpm dev` — ts-node-dev with inspect.
- `pnpm build` / `pnpm start` — compile and run from `build/`.
- `pnpm test` — Jest.

Path aliases (`@/shared`, `@/infra`, `@/modules`) are in `tsconfig.json`; runtime uses `module-alias` when executing compiled output (see `package.json` `_moduleAliases` and `src/index.ts`).

## Adding a feature (checklist)

1. Create module folder under `src/modules/<Module>/` with `dto/`, `repository/`, `repository/prisma/`, `schemas/` (if validated routes), `useCases/`, `<Module>.controller.ts`.
2. Implement repository interface + Prisma repository; export singleton.
3. Implement use case(s); export instances from `useCases/index.ts`.
4. Implement controller: routes, middlewares, `handleResult`.
5. Register controller in [src/modules/index.ts](../../src/modules/index.ts).
6. Add or extend Prisma models if persistence changes; run migrations.
7. Add tests where the team expects them (often `*.test.ts` next to use cases).

## Where to look first

| Need | Location |
|------|----------|
| New route | Module `*.controller.ts` |
| Business rule | Module `useCases/` |
| SQL / DB access | Module `repository/prisma/` |
| Input shape / validation | Module `schemas/` |
| JWT claims shape | `src/shared/types/tokenPayload.ts` |
| Global errors / validation failures | `src/infra/middleware/handleError`, validation zod middleware |
| Success JSON envelope | `src/shared/http/Result.ts`, `BaseController.handleResult` |
| Request / correlation logging | `src/infra/middleware/logging/requestLogger.ts`, `src/shared/logger` |
| Graceful shutdown / readiness | `src/index.ts`, `src/infra/server/shutdown/*`, `GET .../health/ready` |

## Related doc

- [.cursor/api-architecture.md](../api-architecture.md) — infra + shared layout, runtime flow, dependency checklist.
- [.cursor/guides/error-handling-guide.md](error-handling-guide.md) — error handling and logging patterns.