#!/bin/sh

cd /app/client
pm2 start yarn --interpreter sh --name client -- start >/dev/null
sleep 1

cd /app/server
yarn db:migrate || exit 1
yarn db:seed || exit 1
yarn db:scan || exit 1
pm2 start yarn --interpreter sh --name server -- start >/dev/null

echo "Application Started Successfully!"

nginx
pm2 logs
