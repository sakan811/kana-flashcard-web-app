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

# Build the application
RUN npx vite build

# Use a smaller image to serve the application
FROM nginx:alpine

# Install necessary packages for creating users
RUN apk add --no-cache shadow

# Create a non-root user and group with a specific UID and GID
RUN groupadd -g 1001 appgroup && useradd -u 1001 -g appgroup -s /bin/sh -m appuser

# Copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx.conf with /tmp for pid location
COPY nginx.conf /etc/nginx/nginx.conf

# Change ownership of nginx directories to non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/run

# Switch to the non-root user
USER appuser

# Expose port 80 to access the application
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
