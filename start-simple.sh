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

# Install serve if not available
if ! command -v serve >/dev/null 2>&1; then
    echo "Installing serve package..."
    npm install -g serve
fi

PORT=${PORT:-4173}
echo "Starting HTTP server on port $PORT"
echo "Serving from dist/ directory"

exec serve -s dist -p $PORT -H 0.0.0.0