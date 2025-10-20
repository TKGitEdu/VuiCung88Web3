FROM node:18-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn frontend
COPY . .

# Build ứng dụng (nếu cần)
# RUN npm run build

# Cổng mặc định cho React
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]