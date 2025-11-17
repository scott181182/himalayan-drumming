FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl && apt-get clean
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

COPY . /build
WORKDIR /build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile && \
    pnpm run generate

# Build everything and deploy frontend and backend to separate directories
# These are separate stages to improve layer caching and parallelism.
FROM build AS build_frontend
WORKDIR /build/packages/frontend
# No need to deploy, since Next has its own procedures covered in the `frontend` target.
RUN pnpm build

FROM build AS build_backend
WORKDIR /build/packages/backend
RUN pnpm build && pnpm deploy --filter=. --prod --legacy /dist/backend && ls -lha /dist/backend

FROM base AS frontend

ARG NEXT_PUBLIC_API_ROOT_ENDPOINT="/api"
ENV NEXT_PUBLIC_API_ROOT_ENDPOINT=$NEXT_PUBLIC_API_ROOT_ENDPOINT

COPY --from=build_frontend /build/packages/frontend/.next/standalone /app
COPY --from=build_frontend /build/packages/frontend/.next/static /app/packages/frontend/.next/static
COPY --from=build_frontend /build/packages/frontend/public /app/packages/frontend/public
WORKDIR /app/packages/frontend
EXPOSE 3000
CMD [ "node", "/app/packages/frontend/server.js" ]



FROM base AS backend
COPY --from=build_backend /dist/backend /app/backend
WORKDIR /app/backend
EXPOSE 3001
CMD [ "node", "/app/backend/dist/index.js" ]
