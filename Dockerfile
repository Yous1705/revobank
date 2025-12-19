# ======================
# Builder Stage
# ======================
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.12.3

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build


# ======================
# Runtime Stage
# ======================
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@10.12.3

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma generate && node dist/src/main.js"]
