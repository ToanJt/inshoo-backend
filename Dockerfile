FROM node:20-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Build Medusa (output vào .medusa/server)
RUN npx medusa build

# Copy medusa-config đã compile ra /app để migrate tìm thấy
RUN cp .medusa/server/medusa-config.js . 2>/dev/null || \
    cp .medusa/server/src/medusa-config.js . 2>/dev/null || \
    echo "medusa-config not found in build output, will use ts-node"

EXPOSE 9000

CMD ["sh", "-c", "npx medusa db:migrate && npx medusa start"]