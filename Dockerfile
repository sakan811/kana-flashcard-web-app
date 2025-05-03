# Use the latest Node.js Alpine image
FROM node:23.11.0-alpine3.21 AS base

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and package-lock.json first for better caching)
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Production image, copy only necessary files
FROM node:23.11.0-alpine3.21 AS prod

WORKDIR /app

# Copy node_modules and built app from previous stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma/app/generated /app/prisma/app/generated

# Expose port (Next.js default)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]