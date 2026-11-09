FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js seed.js ./
COPY src ./src
ENV NODE_ENV=production
USER node
EXPOSE 4000
CMD ["node", "server.js"]
