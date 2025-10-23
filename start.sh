#!/bin/bash
set -e

echo "=== AutoHub Server Startup ==="
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current working directory: $(pwd)"
echo "PORT environment: ${PORT:-4173}"

echo "Checking if dist directory exists..."
if [ -d "dist" ]; then
    echo "✓ dist directory found"
    ls -la dist/ | head -5
else
    echo "❌ dist directory not found - this will cause issues"
    ls -la .
    exit 1
fi

echo "Ensuring Vite is available..."
if [ ! -f "node_modules/.bin/vite" ]; then
    echo "Installing dependencies including Vite..."
    npm ci --omit=dev --ignore-scripts
fi

# Use PORT environment variable if available, otherwise default to 4173
SERVER_PORT=${PORT:-4173}

echo "Starting Vite preview server..."
echo "Host: 0.0.0.0"
echo "Port: $SERVER_PORT"

# Try to start the server with fallback options
if command -v vite >/dev/null 2>&1; then
    echo "Using global vite command"
    exec vite preview --host 0.0.0.0 --port $SERVER_PORT
elif [ -f "node_modules/.bin/vite" ]; then
    echo "Using local vite binary"
    exec ./node_modules/.bin/vite preview --host 0.0.0.0 --port $SERVER_PORT
else
    echo "Using npm run preview"
    exec npm run preview -- --host 0.0.0.0 --port $SERVER_PORT
fi