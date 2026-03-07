FROM node:20-alpine

WORKDIR /app
ENV NPM_CONFIG_CACHE=/tmp/.npm

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Không build lại, dùng .medusa đã build sẵn từ local
ENV NODE_ENV=production
EXPOSE 10000

CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]