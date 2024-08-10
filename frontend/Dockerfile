# Use the official Node.js image as the base image
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the application
RUN npx vite build

# Use a smaller image to serve the application
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the application
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
