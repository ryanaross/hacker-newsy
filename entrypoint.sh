#!/bin/sh
set -e
mkdir -p /app/data
if [ -n "${PUID}" ] && [ -n "${PGID}" ]; then
	chown -R "${PUID}:${PGID}" /app/data 2>/dev/null || true
	exec su-exec "${PUID}:${PGID}" node build/index.js
fi
exec node build/index.js
