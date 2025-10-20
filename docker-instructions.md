# Sử dụng đoạn mã này làm hướng dẫn cho việc chạy các container Docker

# Bước 1: Khởi động MongoDB container trước
# (Cần thiết vì ứng dụng Spring Boot của bạn cần kết nối MongoDB)
docker-compose -f docker-compose-mongodb.yml up -d

# Bước 2: Build ứng dụng Spring Boot
cd backend/reward-game
mvn clean package -DskipTests

# Bước 3: Build ứng dụng React
cd ../../frontend
npm install
npm run build  # Nếu cần build production

# Bước 4: Sau khi đã build xong cả 2 project, bạn có thể uncomment
# các phần liên quan đến backend và frontend trong docker-compose.yml
# và chạy tất cả các container cùng nhau:
# docker-compose up -d