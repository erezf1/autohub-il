#!/bin/bash
set -e

echo "=== AutoHub Server Startup ==="
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current working directory: $(pwd)"

echo "Checking if dist directory exists..."
if [ -d "dist" ]; then
    echo "✓ dist directory found"
    ls -la dist/ | head -10
else
    echo "❌ dist directory not found - this will cause issues"
    ls -la .
    exit 1
fi

echo "Checking if node_modules/.bin/vite exists..."
if [ -f "node_modules/.bin/vite" ]; then
    echo "✓ Vite binary found"
else
    echo "❌ Vite binary not found - installing production dependencies"
    npm ci --omit=dev
fi

echo "Starting Vite preview server on 0.0.0.0:4173..."
echo "Command: npm run preview -- --host 0.0.0.0 --port 4173"
exec npm run preview -- --host 0.0.0.0 --port 4173