# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install necessary packages for creating users
RUN apk add --no-cache shadow

# Create a non-root user and group with a specific UID and GID
RUN groupadd -g 1000 appgroup && useradd -u 1000 -g appgroup -s /bin/sh -m appuser

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Set ownership of the working directory to the new user
RUN chown -R appuser:appgroup /app

# Expose the port the app runs on
EXPOSE 5000

# Switch to the non-root user
USER appuser

# Command to run the application
CMD ["npm", "start"]
