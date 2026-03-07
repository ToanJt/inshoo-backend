FROM node:20-alpine

WORKDIR /app
ENV NPM_CONFIG_CACHE=/tmp/.npm

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build Medusa (tạo .medusa/server và admin)
RUN npx medusa build

ENV NODE_ENV=production
EXPOSE 10000

CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]