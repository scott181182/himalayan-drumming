#!/usr/bin/zsh

docker run -it -p 8080:80 \
    -v "$(pwd)/blob:/app/blob:ro" \
    -v "$(pwd)/backend/prisma/dev.db:/app/server/prisma/drumming.db:rw" \
    himalayan-drumming
