FROM openjdk:17-slim

WORKDIR /app

# Sao chép file JAR đã build
COPY target/reward-game-0.0.1-SNAPSHOT.jar app.jar

# Cổng mặc định cho Spring Boot
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]