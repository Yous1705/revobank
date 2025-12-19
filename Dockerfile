# builder stage

FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.12.3

COPY package*.json ./

RUN pnpm installrun pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

run pnpm run build


# Runtime Stage

FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@10.12.3

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

COPY /app/package*.json ./package*.json

EXPOSE 3000

CMD ["node", "dist/src/main.js"]