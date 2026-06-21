FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS development
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
EXPOSE 3000
CMD ["npx", "tsx", "watch", "src/index.ts"]

FROM base AS builder
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
