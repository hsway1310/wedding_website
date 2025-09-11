# Stage 1: Build dependencies
# We use this stage to install a static file server and copy our files
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the dependency files first
COPY package*.json ./

# Install a static file server like 'serve'
RUN npm install serve

# Copy all files from your repository
COPY . .

# Stage 2: Create a minimal production image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the static file server and the website files from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.html ./
COPY --from=builder /app/script.js ./
COPY --from=builder /app/style.css ./

# Expose the port your application will listen on.
# Cloud Run injects the PORT environment variable, which defaults to 8080
EXPOSE 8080

# This is the command that will run when the container starts.
# We use 'npx serve' to serve your static files.
CMD ["npx", "serve", "-s", ".", "-l", "8080"]
