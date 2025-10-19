#!/bin/bash
echo "Starting Vite preview server..."
echo "Checking if dist directory exists..."
ls -la dist/
echo "Starting server on 0.0.0.0:4173..."
exec npm run preview -- --host 0.0.0.0 --port 4173