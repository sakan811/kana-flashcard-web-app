# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install bash and netcat
RUN apk add --no-cache bash netcat-openbsd

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Copy shell script into the container
COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh

# Make the script executable
RUN chmod +x /usr/local/bin/wait-for-db.sh

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
