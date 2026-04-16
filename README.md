## Package manager

This template uses `pnpm` only.

### Install

```bash
pnpm install
```

If you run `npm` or `yarn`, install fails by design.

## Quality commands

```bash
pnpm lint
pnpm format
pnpm check
pnpm ci:check
```

`Biome` replaces legacy ESLint and Prettier commands in this template.

## Prisma commands

```bash
pnpm prisma:generate
pnpm prisma:migrate:dev
pnpm prisma:seed
pnpm prisma:studio
```

Notes:
- Prisma now uses generated client source at `src/infra/database/generated/prisma`.
- Prisma CLI reads datasource from `prisma.config.ts` (not from `schema.prisma`).
- Runtime Prisma client uses `@prisma/adapter-pg` with `DATABASE_URL`.
- Seeding is explicit via `pnpm prisma:seed`.
