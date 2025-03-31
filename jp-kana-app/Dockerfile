# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma schema for client generation
COPY prisma ./prisma/

# Generate Prisma client (do this before copying all code for better layer caching)
RUN npx prisma generate

# Copy the tsconfig.json first to ensure TypeScript settings are available
COPY tsconfig.json ./

# Copy the rest of the application code
COPY . .

# Ensure proper directory structure for src folder as defined in tsconfig paths
RUN mkdir -p src

# Set up environment variables for Prisma
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_CDN_URL

# Set default values for environment variables
ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@postgres:5432/postgres?schema=public}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-your-secret-key-here}
ENV NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
ENV NODE_ENV=production

# Build the Next.js application (includes TypeScript compilation)
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Create static file directories with proper permissions
RUN mkdir -p /app/.next/static /app/public /app/static && \
    chown -R nextjs:nodejs /app

# Copy necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Create a directory for static file caching
RUN mkdir -p /app/static/cache && \
    chown -R nextjs:nodejs /app/static

# Set environment variables (will be overridden by runtime values)
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@postgres:5432/postgres?schema=public}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-your-secret-key-here}
ENV NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

# Switch to non-root user
USER nextjs

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Expose the port Next.js runs on
EXPOSE 3000

# Run the Next.js application
CMD ["node", "server.js"]
