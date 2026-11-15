# Stage 1: Build
FROM --platform=$BUILDPLATFORM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build-time arguments (customizáveis via --build-arg ou .env)
ARG PORTFOLIO_URL="https://portfolio.pulz.dev.br"
ARG PORTFOLIO_LABEL="Meu Portfólio"
ARG GITHUB_URL="https://github.com/luizGDpulz"
ARG GITHUB_LABEL="GitHub Pessoal"
ARG HACKER_TRIGGER_TEXT="Estava tentando me hackear?"
ARG HACKER_EMOJI="🕵️‍♂️"
ARG HACKER_MESSAGE="Boa tentativa! Tirar o atributo 'hidden' no DevTools não conta como zero-day, mas ganhou pontos pela curiosidade."
ARG HACKER_IMAGE_URL=""

ENV PORTFOLIO_URL=$PORTFOLIO_URL
ENV PORTFOLIO_LABEL=$PORTFOLIO_LABEL
ENV GITHUB_URL=$GITHUB_URL
ENV GITHUB_LABEL=$GITHUB_LABEL
ENV HACKER_TRIGGER_TEXT=$HACKER_TRIGGER_TEXT
ENV HACKER_EMOJI=$HACKER_EMOJI
ENV HACKER_MESSAGE=$HACKER_MESSAGE
ENV HACKER_IMAGE_URL=$HACKER_IMAGE_URL

RUN pnpm run build

# Stage 2: Runtime
FROM nginx:alpine AS runtime

RUN rm -f /etc/nginx/conf.d/default.conf && mkdir -p /etc/nginx/includes
COPY docker/static-assets.conf /etc/nginx/includes/static-assets.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:80/favicon.svg || exit 1
