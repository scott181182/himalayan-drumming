ARG NEXT_PUBLIC_API_ROOT_ENDPOINT="/api"
ARG DATABASE_URL="file://./drumming.db"

FROM node:18-alpine as build_server

# Move the utility, client, and server files
WORKDIR /build/server
COPY ./backend/package.json ./backend/yarn.lock /build/server/
RUN yarn install --immutable --immutable-cache

# Build the server
COPY ./backend /build/server
RUN yarn build



FROM node:18-alpine as build_client

ENV NEXT_PUBLIC_API_ROOT_ENDPOINT=$NEXT_PUBLIC_API_ROOT_ENDPOINT

WORKDIR /build/client
COPY ./frontend/package.json ./frontend/yarn.lock /build/client/
RUN yarn install --immutable --immutable-cache

# Build the client
COPY ./frontend /build/client
COPY --from=build_server /build/server/schema.graphql /build/server/schema.graphql
RUN yarn build



FROM node:18-alpine
EXPOSE 80 3001

ENV DATABASE_URL=$DATABASE_URL
VOLUME [ "/app/server/prisma/drumming.db" ]

RUN apk update && apk add nginx
# VOLUME [ "/etc/ssl" ]
COPY ./docker/nginx/proxy.conf   /etc/nginx/proxy.conf
COPY ./docker/nginx/default.conf /etc/nginx/sites-available/default

RUN chmod 777 -R /usr/local
RUN chmod 777 -R /var/
RUN mkdir -p /run/nginx && chown node:node /run/nginx
RUN su node -c "yarn global add pm2 ts-node"

ENV PATH "/usr/local/bin:$PATH"
RUN mkdir -p /app/server /app/client && chown -R node:node /app
USER node

# Move files for server
WORKDIR /app/server
COPY --chown=node:node ./backend/package.json ./backend/yarn.lock /app/server/
COPY --chown=node:node ./backend/prisma /app/server/prisma
COPY --chown=node:node --from=build_server /build/server/src /app/server/src
COPY --chown=node:node --from=build_server /build/server/dist /app/server/dist
RUN yarn install --immutable --immutable-cache --production

# Move files for client
WORKDIR /app/client
COPY --chown=node:node --from=build_client /build/client /app/client
RUN yarn install --immutable --immutable-cache --production

# Extra files for Nexus typing
# COPY --chown=node:node ./backend/src/nexus /app/server/src/nexus
# COPY --chown=node:node --from=build_server /build/server/src/generated /app/server/src/generated

WORKDIR /app
COPY ./docker/entrypoint.sh entrypoint.sh
CMD ["sh","/app/entrypoint.sh"]
