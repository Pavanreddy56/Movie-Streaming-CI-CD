# Use Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose backend port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

