# API developer guide

For day-to-day work on this codebase. Skeleton and full base file listings live in [.cursor/api-architecture.md](api-architecture.md).

## Mental model

- **HTTP** is wired in `src/modules/*/*.controller.ts`. Each controller extends `BaseController`, owns an Express `router`, and calls use cases.
- **Business flow** is `controller → use case → repository (interface) → Prisma implementation`.
- **Cross-cutting** lives in `src/infra` (server, middleware, config, DB client) and `src/shared` (Result, errors, logger, settings, reusable schemas/types).

Final URL shape: `http(s)://{host}:{port}{AppSettings.ServerRoot}{route}` (e.g. server root `/api` + controller path `/feature` → `/api/feature`).

## Trace a request

1. Find the route string in a controller’s `initializeRoutes()` (e.g. `this.router.get(\`/${this.baseUrl}\`, ...)`).
2. Follow the handler to the imported use case from `./useCases`.
3. Open `useCases/index.ts` in that module to see how the use case is constructed (repository singleton, optional shared services).
4. Repository interface is under `repository/I*Repository.ts`; Prisma code under `repository/prisma/*.repository.ts` using `prisma` from `@/infra/database/prisma`.

## Controllers

- **Constructor**: `super('<Name>')` for logging/monitoring; set `baseUrl`, call `initializeRoutes()`.
- **Export**: `export default new XxxController()` (singleton).
- **Handlers**: `try { ... this.handleResult(res, await useCase.execute(...)); } catch (e) { next(e); }` so `ApplicationError` and unknown errors reach the global error middleware.
- **Registration**: add the default export to the `controllers` array in [src/modules/index.ts](../src/modules/index.ts).

### Auth

- Protected routes use `TokenClaims` from `@/infra/middleware/authorization` in the route middleware array.
- After `TokenClaims`, `req.claims` is populated (see [src/shared/types/tokenPayload.ts](../src/shared/types/tokenPayload.ts) and Express augmentation in [src/infra/server/core/types/express/index.d.ts](../src/infra/server/core/types/express/index.d.ts)).
- Send `Authorization: Bearer <jwt>`.

### Validation

- Define Zod schemas under the module’s `schemas/` (often `body` / `query` / `params` / `file` keys to match [validate middleware](../src/infra/middleware/validation/zod/index.ts)).
- Wrap routes: `[TokenClaims, validate(yourSchema)]` (order can vary; keep consistent with the team).
- Type handlers with `TypedRequest<typeof yourSchema>` from `@/shared/http/TypedRequest` for `body` / `params` / `query` inference.

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

## DTOs and errors

- **DTOs** live under module `dto/` (and sometimes co-located types). Keep transport shapes separate from Prisma models when mapping manually.
- Throw **`ApplicationError`** from `@/shared/error/ApplicationError` with a message and status code when the use case should produce a controlled HTTP error (middleware formats the response).
- **`RepositoryError`** exists for data-layer concerns; use sparingly and map to `ApplicationError` or `Result` at boundaries if needed.

## Shared providers and services

- **Providers** (`src/shared/providers/*`): SDKs and infrastructure adapters (storage, queues, monitoring, crypto). Use when the capability is not “this module’s DB”.
- **Services** (`src/shared/services/*`): HTTP clients to other internal APIs, orchestration, shared integration logic. Inject into use cases like repositories.

Do not call vendor SDKs or raw axios from controllers; keep that behind interfaces and module `useCases`.

## Prisma

- Client: [src/infra/database/prisma.ts](../src/infra/database/prisma.ts).
- Schema and migrations live under `prisma/`. After schema changes: generate client and migrate per team process.

## Config and local run

- Environment loading: [src/infra/config/index.ts](../src/infra/config/index.ts).
- Typed static access after boot: [src/shared/settings/AppSettings.ts](../src/shared/settings/AppSettings.ts) (`AppSettings.init` runs from `App`).

Useful scripts from `package.json`:

- `npm run dev` — ts-node-dev with inspect.
- `npm run build` / `npm start` — compile and run from `build/`.
- `npm test` — Jest.
- `npm run generate:module` — scaffold module (when applicable).

Path aliases (`@/shared`, `@/infra`, `@/modules`) are in `tsconfig.json`; runtime uses `module-alias` (see `package.json` `_moduleAliases` for production paths).

## Adding a feature (checklist)

1. Create module folder under `src/modules/<Module>/` with `dto/`, `repository/`, `repository/prisma/`, `schemas/` (if validated routes), `useCases/`, `<Module>.controller.ts`.
2. Implement repository interface + Prisma repository; export singleton.
3. Implement use case(s); export instances from `useCases/index.ts`.
4. Implement controller: routes, middlewares, `handleResult`.
5. Register controller in [src/modules/index.ts](../src/modules/index.ts).
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
| API response envelope | `src/shared/http/Result.ts`, `BaseController.handleResult` |

## Related doc

- [.cursor/api-architecture.md](api-architecture.md) — infra + shared skeleton, embedded base code, provider/service patterns.
