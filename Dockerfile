FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 10000

CMD ["sh", "-c", "cd /app/.medusa/server && npx medusa db:migrate && npx medusa start"]