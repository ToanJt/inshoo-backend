FROM node:20-alpine

WORKDIR /app

# Copy package files trước
COPY package*.json ./

# ← Xoá --mount cache (gây EBUSY), dùng npm ci thẳng
RUN npm ci --legacy-peer-deps

# Copy toàn bộ source
COPY . .

# Build Medusa
RUN npm run build

EXPOSE 9000

CMD ["sh", "-c", "npx medusa migrations run && npx medusa start"]