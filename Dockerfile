# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies if needed (though Nest usually doesn't need much)
# Copy yarn.lock and package.json for better caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code and build the application
COPY . .
RUN yarn build


# Stage: 2: Production stage
FROM node:20-alpine
WORKDIR /app

# Use dumb-init for proper signal handling (prevents zombie processes)
RUN apk add --no-cache dumb-init

# Copy only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

# Expose port
EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
# Start application
CMD ["node", "dist/main"]
