# Stage 1: Build dependencies
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the dependency files first to leverage Docker's layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Run any build scripts if needed
# For static sites, this might not be necessary
# For Express, it might involve something like 'npm run build'
RUN npm run build || echo "No build script found, continuing..."

# Stage 2: Create a minimal production image
# We use the same lightweight base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the built files from the 'builder' stage
# This creates a smaller, more secure image without dev dependencies
COPY --from=builder /app/. /app/

# Expose the port your application will listen on.
# Cloud Run injects the PORT environment variable, which defaults to 8080.
EXPOSE 8080

# This is the command that will run when the container starts.
# We use 'npm start' as a flexible command.
# In your package.json, you would define "start": "npx serve -s . -l $PORT" or "start": "node server.js"
CMD ["npm", "start"]
