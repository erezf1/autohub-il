#!/bin/bash
set -e

echo "=== Simple HTTP Server Startup ==="
echo "Node.js version: $(node --version)"
echo "Current working directory: $(pwd)"

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found"
    exit 1
fi

PORT=${PORT:-4173}
echo "Starting HTTP server on port $PORT"
echo "Serving from dist/ directory"

# Use npx to run serve from local node_modules
exec npx serve -s dist -p $PORT -H 0.0.0.0