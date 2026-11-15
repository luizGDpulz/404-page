# Changelog

Todas as alterações notáveis deste projeto são documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Não lançado]

---

## [1.1.1] - 2026-11-15

### 🐛 Corrigido
- Adicionado `proxy_intercept_errors off;` em `docker/npm/fallback_proxy.conf` e `docs/npm-setup.md` para impedir que o NPM re-interceptasse os códigos `502`/`503`/`504` retornados pelo próprio container `404-page:8080` (#6).

---

## [1.1.0] - 2026-11-15

### 🚀 Adicionado
- Suporte completo *status-aware* com páginas estáticas dedicadas para `404` (rota/host inexistente), `502` (container offline/parado), `503` (serviço em manutenção) e `504` (gateway timeout) (#2).
- Componente reutilizável `ErrorPage.astro`, módulo de configuração tipada (`src/config/env.ts` e `src/config/errors.ts`) e botão interativo **Tentar novamente** para falhas temporárias (#2).
- Arquitetura dual-port no Nginx (`:80` para catch-all 404 anti-spoofing e `:8080` para fallback de upstreams offline via `X-Error-Code`) (#3).
- Content Negotiation automática por `Accept`: retorna HTML para navegadores e JSON estruturado (`/errors/*.json`) para clientes de API (`Accept: application/json`) (#3).
- Passthrough automático para bordas Cloudflare (`CF-Ray`), convertendo respostas `502`/`504` para HTTP `503` com cabeçalho `Retry-After` sem perder a UI do erro real (#3).
- Templates prontos para Nginx Proxy Manager em `docker/npm/server_proxy.conf` e `docker/npm/fallback_proxy.conf` (#3).
- `HEALTHCHECK` nativo no `Dockerfile` e hardening `no-new-privileges` no `docker-compose.yml` (#3).
- Guia detalhado de configuração com NPM em `docs/npm-setup.md` e documentação atualizada no `README.md` (#4).

### 🛠️ Modificado
- `README.md` reescrito deixando explícita a integração com Nginx Proxy Manager e a independência da camada de borda (#4).
- `.env.example` limpo removendo variável obsoleta (`MESSAGE_TEMPLATE`) (#3).

[Não lançado]: https://github.com/luizGDpulz/404-page/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/luizGDpulz/404-page/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/luizGDpulz/404-page/releases/tag/v1.1.0
