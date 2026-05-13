# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy all backend source files
COPY backend/ .

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
