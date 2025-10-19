#!/bin/bash
echo "Installing dependencies with devDependencies..."
NODE_ENV=development npm ci
echo "Building application..."
npm run build
echo "Build completed successfully!"