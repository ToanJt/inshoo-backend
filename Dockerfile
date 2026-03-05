@"
FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx medusa build

WORKDIR /app/.medusa/server

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]
"@ | Out-File -FilePath Dockerfile -Encoding utf8 -NoNewline