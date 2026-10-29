#!/usr/bin/env bash
set -euo pipefail

echo "==> Resetting MyLifeOS local database..."

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Reset SQLite local DB file if exists
if [ -d "$ROOT_DIR/app" ]; then
  echo "==> Clearing local SQLite database artifacts..."
  rm -f "$ROOT_DIR/app/mylifeos.db" "$ROOT_DIR/app/mylifeos.db-shm" "$ROOT_DIR/app/mylifeos.db-wal" || true
fi

# Reset PostgreSQL if running docker-compose
if [ -f "$ROOT_DIR/server/docker-compose.yml" ]; then
  echo "==> Restarting server postgres container if running..."
  (cd "$ROOT_DIR/server" && docker-compose down -v 2>/dev/null && docker-compose up -d postgres 2>/dev/null) || true
fi

echo "==> Database reset complete."
