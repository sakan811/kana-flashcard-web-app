# Build dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app

# Install only essential OS dependencies with a single layer
RUN apk add --no-cache openssl libc6-compat

# Copy only the necessary files for package installation
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm ci && \
    npx prisma generate && \
    npm cache clean --force

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Build the application with Next.js output as standalone
ENV NODE_ENV=production
RUN npm run build

# Production stage - using a smaller alpine image
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user with minimal permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs --ingroup nodejs

# Copy only essential files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Create cache directory with correct permissions
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .

# Switch to non-root user for security
USER nextjs

EXPOSE 3000

# Add health check for container monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000/ || exit 1

# Run the Next.js application - changed from "server.js" to use npx for Prisma and Next.js
CMD ["sh", "-c", "npx prisma migrate deploy && npx next start"]
