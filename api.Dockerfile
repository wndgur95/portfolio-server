FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV NODE_ENV=prod

RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN rm -rf dist

RUN pnpm run build api

COPY config/* ./config/

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/config/* ./config/
EXPOSE 80
CMD ["node", "dist/apps/api/src/main"]
