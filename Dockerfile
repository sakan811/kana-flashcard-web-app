# Use the latest Node.js Alpine image
FROM node:23.11.1-alpine3.22 AS base

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package.json, package-lock.json, and prisma directory for dependency installation
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Change ownership of the app directory to the nextjs user
RUN chown -R nextjs:nodejs /app

# Production image, copy only necessary files
FROM node:23.11.1-alpine3.22 AS prod

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copy node_modules and built app from previous stage
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=base --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=base --chown=nextjs:nodejs /app/prisma/app/generated /app/prisma/app/generated

# Switch to the non-root user
USER nextjs

# Expose port (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]