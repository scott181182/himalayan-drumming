#!/bin/sh
set -e

echo "Running database migrations..."
pnpm exec zen migrate deploy
echo "Running seed scripts..."
node scripts/db_seed.js
echo "Done!"
