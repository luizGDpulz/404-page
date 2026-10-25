# Stage 1: Build da aplicação estática (Astro + Tailwind CSS)
# Usa $BUILDPLATFORM para compilar em velocidade nativa mesmo em builds multi-arch (amd64/arm64)
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: Servidor ultra-leve Nginx Alpine (< 10MB RAM)
FROM nginx:alpine AS runtime

# Remove configuração default e aplica configuração semântica HTTP 404
RUN rm -f /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Script de entrypoint para injetar variáveis de ambiente no config.json em runtime
COPY docker/40-generate-config.sh /docker-entrypoint.d/40-generate-config.sh
RUN chmod +x /docker-entrypoint.d/40-generate-config.sh

# Copia os assets estáticos compilados pelo Astro
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
