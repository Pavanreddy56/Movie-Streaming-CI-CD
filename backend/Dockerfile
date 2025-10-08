# Use Node.js LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend using pm2
RUN npm install -g pm2
CMD ["pm2-runtime", "server.js", "--name", "movie-backend"]
