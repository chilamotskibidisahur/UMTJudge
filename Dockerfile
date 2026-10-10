# ==============================================================================
# UMTJudge — Production Dockerfile
# ==============================================================================
FROM node:22-alpine

# Cài đặt docker-cli để gọi Docker Sandbox chấm bài, python3/make/g++ cho native dependencies
RUN apk add --no-cache docker-cli python3 make g++ gcc musl-dev

WORKDIR /app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy toàn bộ mã nguồn
COPY . .

# Build Vite frontend production bundle
RUN npx vite build

# Mở cổng 4000 cho backend HTTP và Socket.IO
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000
ENV SCHOOLJUDGE_DB_MODE=postgres
ENV JUDGE_WORKERS=2

# Khởi chạy máy chủ
CMD ["node", "server/index.cjs"]
