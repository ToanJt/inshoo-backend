FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm

COPY package*.json .npmrc ./

RUN npm ci --legacy-peer-deps

COPY . .

# ✅ DEBUG: Kiểm tra medusa-config.ts có tồn tại không
RUN echo "=== Files in /app ===" && ls -la /app/medusa-config* || echo "❌ medusa-config NOT FOUND!"

# ✅ BUILD: Compile TypeScript → .medusa/server/
RUN npx medusa build

# ✅ DEBUG: Kiểm tra output build
RUN echo "=== Files in .medusa/server ===" && ls -la /app/.medusa/server/medusa-config* || echo "❌ Build output NOT FOUND!"

# ✅ Cài dependencies cho server đã build
WORKDIR /app/.medusa/server
RUN npm ci --legacy-peer-deps

ENV NODE_ENV=production

EXPOSE 8080

CMD ["sh", "-c", "npx medusa db:migrate && node ./node_modules/@medusajs/medusa/dist/commands/start.js"]