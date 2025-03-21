# Stage 1: Build frontend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json và lockfile trước để tận dụng cache
COPY frontend/package.json frontend/yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy toàn bộ frontend source code
COPY frontend ./

# Build frontend (ví dụ: React, Vue, Angular)
RUN yarn build

# Stage 2: Serve frontend using nginx
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Copy build output từ builder stage
COPY --from=builder /app/dist .

# Expose default Nginx port
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
