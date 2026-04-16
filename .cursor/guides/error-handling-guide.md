# Error handling guide

## Goals
- single error response contract (`application/problem+json`, RFC7807)
- explicit ownership of error translation per layer
- actionable logs with request correlation
- safe shutdown on deploy/restart/fatal signals

## Error contract
- all failures return:
  - `type`, `title`, `status`, `detail`, `instance`, `code`
  - `requestId` always when request-scoped
  - `errors` only for validation failures
- never leak stack trace or raw driver errors to client

## Layer rules
- controller
  - parse http input
  - call use case
  - pass errors to `next(error)`
  - never implement business logic
- use case
  - implement business rules
  - throw `ApplicationError` subclasses for expected operational failures
  - map infra-level exceptions to semantic errors
- repository/provider
  - catch driver/sdk errors
  - throw typed infra errors (`RepositoryError`, etc.)
  - never return raw prisma/sql/http client errors upward
- middleware
  - auth/validation middleware throw typed errors
  - global error middleware maps unknown errors to internal server error

## Logging rules
- use structured logger only (`pino`)
- include `requestId` in request and error logs
- redact secrets (`authorization`, `cookie`, tokens, passwords)
- operational errors log `warn`; unexpected/fatal log `error`/`fatal`

## Shutdown rules
- on `SIGTERM`/`SIGINT`: mark readiness false, stop accepting requests, drain, close prisma, exit
- on `uncaughtException`/`unhandledRejection`: log fatal, run same shutdown flow, exit non-zero
- always keep force-exit timeout as safety net

## Naming and codes
- keep machine code stable (e.g. `VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`)
- keep `title` short, `detail` human-readable
- prefer app-specific `type` URI pattern: `/problems/<slug>`
