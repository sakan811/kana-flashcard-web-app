# Build dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat

# Install dependencies with cache optimization
COPY package*.json ./
RUN npm ci --only=production
COPY prisma ./prisma/
RUN npx prisma generate

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source files
COPY . .

# Build application
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --only=production && \
    npm cache clean --force

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Add node_modules/.bin to PATH and set NODE_PATH
ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_PATH=/app/.next/standalone/node_modules

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs --ingroup nodejs

# Copy only necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Set correct permissions
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", ".next/standalone/server.js"]
