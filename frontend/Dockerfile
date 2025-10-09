# Stage 1: Build the frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@11.6.2
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

