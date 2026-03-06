FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm

# 1. Copy file package và cài đặt TẤT CẢ thư viện (kể cả devDependencies để build Admin)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 2. Copy mã nguồn
COPY . .

# 3. Chạy build để sinh ra lõi backend VÀ thư mục giao diện Admin
RUN npm run build

# 4. BẮT BUỘC: Chỉ đặt môi trường production SAU KHI đã build xong
ENV NODE_ENV=production

EXPOSE 10000

# 5. Chạy lệnh trực tiếp từ thư mục gốc /app
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]