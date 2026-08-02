FROM node:24-slim AS base
RUN apt-get update -y && apt-get install -y openssl && apt-get clean

FROM base AS pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack use pnpm@11.18.0

FROM scratch AS source-files
COPY ./public /build/public
COPY ./scripts /build/scripts
COPY ./src /build/src
COPY ./zenstack /build/zenstack
COPY ./tsconfig.json ./next.config.ts ./postcss.config.mjs ./graphql.config.json ./codegen.ts /build/

FROM pnpm AS dependencies
ENV NODE_ENV=production
WORKDIR /build
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
# RUN echo "node-linker=hoisted" >> ./.npmrc
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile
COPY --from=source-files /build /build
RUN pnpm run generate

FROM dependencies AS build
RUN pnpm build

FROM dependencies AS migrate-build
COPY ./tsconfig.json /build/
COPY --from=source-files /build/src /build/src
COPY --from=source-files /build/scripts /build/scripts
RUN pnpm exec tsup scripts/db_seed.ts

FROM pnpm AS migrate
WORKDIR /app
COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
# Dependencies necessary to run migration AND seed script(s).
RUN pnpm install @zenstackhq/cli @zenstackhq/orm @zenstackhq/schema pg
COPY ./zenstack /app/zenstack
COPY ./docker/migrate_entrypoint.sh /app/entrypoint.sh
COPY --from=migrate-build /build/dist/db_seed.js /app/scripts/db_seed.js

ENTRYPOINT [ "/app/entrypoint.sh" ]

FROM base AS frontend
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/build

COPY --from=build --chown=node:node /build/public /app/build/public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown node:node .next

# Have to copy from standalone/build since Nextjs currently include workspace name for pnpm builds
# See https://github.com/vercel/next.js/issues/84257
COPY --from=build --chown=node:node /build/.next/standalone/build /app/build
COPY --from=build --chown=node:node /build/.next/static /app/build/.next/static
COPY --from=build --chown=node:node /build/src/generated /app/build/src/generated

USER node
EXPOSE 3000
ENTRYPOINT [ "node" ]
CMD [ "/app/build/server.js" ]
