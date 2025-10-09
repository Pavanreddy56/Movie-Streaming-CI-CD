# frontend/Dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# If Next app uses export or build:
RUN npm run build
# If using `next export` (static):
# RUN npm run export

# Production stage - serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/out /usr/share/nginx/html
# If your Next build outputs .next server or needs server: adjust accordingly.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
