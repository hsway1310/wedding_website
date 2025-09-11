FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy all static files (HTML, CSS, JS, MP4, etc.)
COPY . .

# Expose Cloud Run port
EXPOSE 8080

# Start the server, using the serve.json config automatically
CMD ["serve", "-s", ".", "-l", "8080"]