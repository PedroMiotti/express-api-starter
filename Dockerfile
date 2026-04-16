FROM node:16-alpine as dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm i --frozen-lockfile

COPY . .

RUN pnpm prisma generate

FROM dependencies as builder

RUN pnpm run build

CMD pnpm run start
