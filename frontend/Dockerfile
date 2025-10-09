# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend    # <- frontend folder
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build        # this will now correctly find index.html

# Stage 2: Production Frontend
FROM nginx:stable-alpine AS frontend-prod
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


