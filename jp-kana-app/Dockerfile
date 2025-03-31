# Use the official Node.js image as the base image
FROM node:20-alpine AS deps

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with explicit production flag for better caching
RUN npm ci --only=production && \
    npm install prisma --no-save && \
    # Keep a clean npm cache to reduce image size
    npm cache clean --force

# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy only necessary files for build
COPY prisma ./prisma/
COPY public ./public/
COPY src ./src/
COPY .env.example ./.env.example
COPY next.config.js ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY tailwind.config.js ./

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Production image - using the smallest possible alpine image
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV for better Next.js optimization
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Copy only production dependencies from deps stage
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy only necessary built files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
# Only copy essential Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Ensure .next directory has correct permissions
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs .next && \
    chmod -R 755 .next && \
    # Clean up any unnecessary files to reduce image size
    rm -rf /tmp/* /var/cache/apk/*

# Switch to non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Run the Next.js application
CMD ["npm", "start"]
