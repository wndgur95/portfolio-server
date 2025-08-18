FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=prod

RUN corepack enable
RUN corepack prepare pnpm@9.10.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# 프로덕션 의존성만 설치
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# 빌드된 파일만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

# 불필요한 파일 제거
RUN rm -rf /app/node_modules/.cache /app/node_modules/.pnpm

EXPOSE 80
CMD ["node", "dist/apps/api/src/main"]
