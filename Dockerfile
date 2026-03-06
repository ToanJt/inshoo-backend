FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm

COPY package*.json ./

# Lúc cài đặt, KHÔNG để production để npm cài cả devDependencies (cần thiết cho việc build Admin)
RUN npm install --legacy-peer-deps

COPY . .

# Build backend và giao diện Admin
RUN npm run build

# Chỉ đặt môi trường production SAU KHI đã build xong mọi thứ
ENV NODE_ENV=production

EXPOSE 10000

CMD ["sh", "-c", "cd /app/.medusa/server && npx medusa db:migrate && npx medusa start"]