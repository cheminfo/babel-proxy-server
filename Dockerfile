FROM node:16.17.0

WORKDIR /app
COPY ./ ./
RUN npm ci --omit=dev

ENTRYPOINT ["node", "src/server.js"]
