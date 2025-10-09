# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all frontend files (since we're already in frontend folder)
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built files from previous stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
