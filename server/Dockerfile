FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./

# 업로드 디렉토리 권한
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

USER node
EXPOSE 5000
CMD ["node", "src/index.js"]
