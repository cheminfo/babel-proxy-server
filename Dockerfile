FROM node:24-alpine

WORKDIR /app
COPY ./ ./
RUN npm ci --omit=dev

ENTRYPOINT ["node", "src/server.js"]
