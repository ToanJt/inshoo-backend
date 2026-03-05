FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx medusa build

EXPOSE 9000

CMD ["sh", "-c", "cd /app && npx medusa db:migrate && npx medusa start"]