# Use the latest Node.js Alpine image
FROM node:23.11.1-alpine3.22 AS base

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

# Production image, copy only necessary files
FROM node:23.11.1-alpine3.22 AS prod

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