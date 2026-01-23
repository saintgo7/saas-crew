# =============================================================================
# WKU Software Crew API - Production Dockerfile
# Multi-stage build for optimized production image
# =============================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies (production + dev for build)
# Use shamefully-hoist for traditional node_modules structure (needed for Prisma)
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter @wku-crew/api db:generate

# Build the application
RUN pnpm --filter @wku-crew/api build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init for proper PID 1 handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Set production environment
ENV NODE_ENV=production
ENV PORT=4000

# Copy necessary files from builder
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma

# Copy full node_modules structure (pnpm uses symlinks, need the entire structure)
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start the application with dumb-init
CMD ["dumb-init", "node", "dist/main.js"]
