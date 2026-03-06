FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# BẮT BUỘC: Chạy lệnh build để biên dịch code và sinh ra thư mục .medusa/server
RUN npm run build

EXPOSE 10000

CMD ["sh", "-c", "cd /app/.medusa/server && npx medusa db:migrate && npx medusa start"]