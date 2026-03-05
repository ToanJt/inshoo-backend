FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 9000

# ← Đổi "migrations run" thành "db:migrate"
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]