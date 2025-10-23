# Simple production Dockerfile
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "dist/src/main.js"]
