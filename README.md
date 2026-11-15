# 404-page

Central de contingência e páginas de erro HTTP (**404**, **502**, **503** e **504**) moderna, responsiva, ultra-leve (`< 10MB RAM`) e 100% modular, construída com **Astro**, **Tailwind CSS** e **TypeScript**, empacotada em container `nginx:alpine`.

Projetada especificamente para operar em conjunto com o **Nginx Proxy Manager (NPM)**, sendo totalmente **agnóstica à camada de borda** (funciona com Cloudflare, outra CDN/WAF, Load Balancer ou exposição direta).

> 📖 **Guia Completo de Instalação & NPM:** Para configurar do zero (subir ou clonar o container, configurar o host wildcard no NPM, interceptar serviços offline e validar com `curl`), siga o passo a passo detalhado em **[`docs/npm-setup.md`](./docs/npm-setup.md)**.

---

## ✨ Funcionalidades

- **Cobertura Status-Aware Completa (`404`, `502`, `503`, `504`):**
  - **`404 Not Found` (Porta `80`):** Para subdomínios ou rotas inexistentes. Mantém status HTTP `404` real, tema camaleão aleatório por reload e sugestão de typos via distância Levenshtein.
  - **`502 Bad Gateway` (Porta `8080`):** Quando um host existe no NPM, mas o container de destino está parado ou iniciando. Exibe UI semântica em âmbar (*Serviço temporariamente offline*) com botão funcional **Tentar novamente**.
  - **`503 Service Unavailable` (Porta `8080`):** Para serviços em manutenção ou temporariamente indisponíveis.
  - **`504 Gateway Timeout` (Porta `8080`):** Quando o container upstream está vivo, mas excedeu o tempo limite de resposta.
- **Independência de Borda & Passthrough Cloudflare-Safe:**
  - Atrás da **Cloudflare (Free)**, a borda intercepta respostas `502`/`504` da origem e as substitui por telas cinzas genéricas. O container detecta automaticamente o cabeçalho `CF-Ray` e entrega HTTP `503` + `Retry-After` preservando a interface visual real do erro (`502` ou `504`).
  - Em acesso direto ou atrás de outras bordas (sem `CF-Ray`), devolve o código HTTP nativo exato (`502`, `503` ou `504`).
- **Content Negotiation Inteligente (`HTML` vs `JSON`):**
  - Navegadores (`Accept: text/html`) recebem a página visual completa.
  - Clientes de API (`Accept: application/json`) recebem payload JSON estruturado e limpo, evitando quebras de *JSON parsing* em frontends e apps quando uma API cai.
- **Segurança Anti-Spoofing Dual-Port:**
  - A porta `80` (exposta via wildcard `*.dominio.com`) ignora cabeçalhos `X-Error-Code` externos.
  - A porta `8080` recebe exclusivamente o tráfego interno desviado pelo NPM via `proxy_intercept_errors` na rede `proxy-net`.
- **Entrega 100% Estática (Build-Time) e Modular:**
  - Zero requisições em runtime e assets servidos com `200 OK` (`/_astro/*` e `/favicon.svg`) mesmo em hosts offline.
  - Defina apenas `GITHUB_URL`, apenas `PORTFOLIO_URL`, ambos ou deixe ambos vazios para omitir os links do HTML estático.
- **Easter Egg Secreto no DOM (`hidden` + `<dialog>`):**
  - Bloco `<div id="hacker-secret" hidden>` no HTML com dica no console do DevTools; ao remover `hidden`, revela um modal estilo mini-terminal customizável.

---

## ⚙️ Variáveis de Ambiente no Build (`.env` ou Build Args)

| Variável | Descrição | Padrão |
| :--- | :--- | :--- |
| `PORTFOLIO_URL` | URL do portfólio (vazio omite o botão) | `"https://portfolio.pulz.dev.br"` |
| `PORTFOLIO_LABEL` | Texto do botão do portfólio | `"Meu Portfólio"` |
| `GITHUB_URL` | URL do GitHub (vazio omite o botão) | `"https://github.com/luizGDpulz"` |
| `GITHUB_LABEL` | Texto do botão do GitHub | `"GitHub Pessoal"` |
| `HACKER_TRIGGER_TEXT` | Texto do botão secreto no DOM | `"Estava tentando me hackear?"` |
| `HACKER_EMOJI` | Emoji exibido no modal secreto | `"🕵️‍♂️"` |
| `HACKER_MESSAGE` | Mensagem exibida no modal secreto | `"Boa tentativa! Tirar o atributo 'hidden'..."` |
| `HACKER_IMAGE_URL` | URL opcional de imagem/GIF no modal | `""` |

---

## 🚀 Como Rodar com Docker

> Consulte [`docs/npm-setup.md`](./docs/npm-setup.md) para o guia completo de integração com o Nginx Proxy Manager.

### Opção 1: Via `docker-compose.yml` (Imagem Oficial GHCR)

```yaml
services:
  404-page:
    image: ghcr.io/luizgdpulz/404-page:latest
    container_name: 404-page
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    expose:
      - "80"
      - "8080"
    networks:
      - proxy-net

networks:
  proxy-net:
    external: true
```

### Opção 2: Build Customizado com seus próprios links

```bash
docker build \
  --build-arg PORTFOLIO_URL="https://seu-portfolio.com" \
  --build-arg PORTFOLIO_LABEL="Meu Site" \
  --build-arg GITHUB_URL="https://github.com/seu-user" \
  -t 404-page-custom .
```

### Templates do NPM Inclusos

Os arquivos de configuração customizada do NPM estão versionados no repositório para cópia direta no volume `/data/nginx/custom/`:
- [`docker/npm/server_proxy.conf`](./docker/npm/server_proxy.conf)
- [`docker/npm/fallback_proxy.conf`](./docker/npm/fallback_proxy.conf)

---

## 🛠️ Desenvolvimento Local (`pnpm`)

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente de exemplo (opcional)
cp .env.example .env

# Iniciar servidor de desenvolvimento (http://localhost:4321)
# Rotas disponíveis em dev: /, /502, /503, /504
pnpm dev

# Verificar tipagem TypeScript
pnpm exec tsc --noEmit

# Gerar build estático de produção (dist/)
pnpm build
```

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](./LICENSE) para mais informações.
