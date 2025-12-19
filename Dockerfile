# builder stage
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10.12.3

COPY package*.json ./
COPY prisma ./prisma

RUN pnpm install
RUN pnpm prisma generate   # ⭐ WAJIB DI SINI

COPY . .
RUN pnpm run build


# runtime stage
FROM node:22-alpine
WORKDIR /app

RUN npm install -g pnpm@10.12.3

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
