# backend/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .

# If you have a build step (e.g. TypeScript), run it here:
# RUN npm run build

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
