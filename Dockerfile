FROM node:20-alpine

WORKDIR /app

# Đưa npm cache ra ngoài /app hoàn toàn
ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_ENV=production

COPY package*.json ./

# Dùng npm install thay vì npm ci để tránh xoá cache
RUN npm install --legacy-peer-deps

COPY . .

RUN npx medusa build

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
```

---

## Trên Railway Dashboard — ép dùng Dockerfile
```
Service → Settings → Build
→ Builder → "Dockerfile"     ← chọn cái này
→ Dockerfile Path → "Dockerfile"
→ Save