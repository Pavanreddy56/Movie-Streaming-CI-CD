# Stage 1: Build the frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Ensure latest npm and install dependencies
RUN npm install -g npm@11.6.2
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Add module type for ESM compatibility
RUN echo '{ "type": "module" }' > package.json

# Build the frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy build output from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

