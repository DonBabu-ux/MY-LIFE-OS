FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configurations
COPY package.json tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

# Install dependencies
RUN npm install

# Copy shared and server sources
COPY shared ./shared
COPY server ./server

# Build shared first, then server
WORKDIR /app/server
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"]
