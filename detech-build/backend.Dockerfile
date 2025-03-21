# Stage 1: Build backend
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy toàn bộ backend source code
COPY backend ./

# Build Metabase
RUN ./bin/build.sh

# Stage 2: Run backend
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Copy Metabase jar từ builder stage
COPY --from=builder /app/target/uberjar/metabase.jar .

EXPOSE 3000

CMD ["java", "-jar", "metabase.jar"]
