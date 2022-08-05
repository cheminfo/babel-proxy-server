FROM node:16

WORKDIR /app
COPY ./ ./
RUN npm ci --production

CMD ["node", "src/server.js"]
