# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies required for build
RUN apk add --no-cache openssl libc6-compat

# Copy only necessary files for build
COPY package*.json ./
COPY prisma ./prisma/
COPY .env.example ./.env
COPY next.config.js ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY tailwind.config.js ./
COPY public ./public/
COPY src ./src/

# Install dependencies, generate prisma, build, and clean up in a single layer
RUN npm ci && \
    npx prisma generate --schema=./prisma/schema.prisma && \
    npm run build && \
    npm prune --production && \
    npm cache clean --force

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only required runtime dependencies
RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs --ingroup nodejs && \
    chown -R nextjs:nodejs /app

# Copy only the necessary built files and production dependencies
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Create cache directory with correct permissions
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next

# Switch to non-root user
USER nextjs

# Expose port and add healthcheck
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["npm", "start"]
