# Use Node.js LTS alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy all backend code
COPY . .

# Expose port (backend server port)
EXPOSE 5000

# Start server
CMD ["node", "server.js"]

