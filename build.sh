#!/bin/bash
echo "Installing dependencies with devDependencies..."
NODE_ENV=development npm ci
echo "Installing serve for production..."
npm install serve
echo "Building application..."
npm run build
echo "Build completed successfully!"