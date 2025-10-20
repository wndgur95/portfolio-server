FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@9.10.0 --activate
# 네이티브 바이너리 빌드를 위한 빌드 도구 설치
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# 모든 의존성 설치 (devDependencies 포함)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# production 의존성만 설치
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN pnpm run build app

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# 비특권 사용자 생성
RUN groupadd -r appuser && useradd -r -g appuser appuser

# production 의존성만 복사
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config

# 불필요한 파일들 제거 (더 효율적으로)
RUN find /app/node_modules -name "*.md" -o -name "*.txt" -o -name "LICENSE" -o -name "CHANGELOG" -o -name "README" | xargs rm -f && \
    find /app/node_modules -name "test" -o -name "tests" -o -name "docs" -type d -exec rm -rf {} + 2>/dev/null || true

# 소유권 변경 및 비특권 사용자로 전환
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8080
CMD ["node", "dist/apps/src/main"]
