# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Ensure we install ALL dependencies including devDependencies
ENV NODE_ENV=development
RUN npm ci

# Copy source code
COPY . .

# Build the application (Vite should now be available)
RUN npm run build

# Copy and prepare startup scripts
COPY start.sh ./
COPY start-simple.sh ./
RUN chmod +x start.sh start-simple.sh

# Install serve globally
RUN npm install -g serve

# Switch to production and clean up devDependencies
ENV NODE_ENV=production
RUN npm prune --production

# Expose port
EXPOSE 4173

# Start the application
CMD ["./start-simple.sh"]