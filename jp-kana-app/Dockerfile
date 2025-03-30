# Use the official Node.js image as the base image for building the application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the application with environment variables
ARG VITE_POSTGRES_HOST
ARG VITE_POSTGRES_PORT
ARG VITE_POSTGRES_USER
ARG VITE_POSTGRES_PASSWORD
ARG VITE_POSTGRES_DB

# Set default values for environment variables
ENV VITE_POSTGRES_HOST=${VITE_POSTGRES_HOST:-postgres}
ENV VITE_POSTGRES_PORT=${VITE_POSTGRES_PORT:-5432}
ENV VITE_POSTGRES_USER=${VITE_POSTGRES_USER:-postgres}
ENV VITE_POSTGRES_PASSWORD=${VITE_POSTGRES_PASSWORD:-postgres}
ENV VITE_POSTGRES_DB=${VITE_POSTGRES_DB:-postgres}

# Set DATABASE_URL for Prisma
ENV DATABASE_URL=postgresql://${VITE_POSTGRES_USER}:${VITE_POSTGRES_PASSWORD}@${VITE_POSTGRES_HOST}:${VITE_POSTGRES_PORT}/${VITE_POSTGRES_DB}

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npx vite build

# Use a smaller image to serve the application
FROM nginx:alpine

# Install necessary packages for creating users and running Prisma
RUN apk add --no-cache shadow nodejs npm

# Create a non-root user and group with a specific UID and GID
RUN groupadd -g 1001 appgroup && useradd -u 1001 -g appgroup -s /bin/sh -m appuser

# Copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Prisma files for migrations
COPY --from=build /app/node_modules/.prisma /usr/share/nginx/html/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma /usr/share/nginx/html/node_modules/@prisma
COPY --from=build /app/prisma /usr/share/nginx/html/prisma
COPY --from=build /app/package.json /usr/share/nginx/html/package.json

# Copy custom nginx.conf with /tmp for pid location
COPY nginx.conf /etc/nginx/nginx.conf

# Change ownership of nginx directories to non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/run

# Set working directory
WORKDIR /usr/share/nginx/html

# Switch to the non-root user
USER appuser

# Expose port 80 to access the application
EXPOSE 80
