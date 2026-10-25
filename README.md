# 404-page

Página de erro **HTTP 404** moderna, responsiva, ultra-leve (`< 10MB RAM`) e 100% modular, construída com **Astro**, **Tailwind CSS** e **TypeScript**, empacotada em container `nginx:alpine`.

Projetada para atuar como *catch-all fallback* elegante em infraestruturas com DNS Wildcard e proxy reverso (Cloudflare + Nginx Proxy Manager).

---

## ✨ Funcionalidades

- **Retorno HTTP 404 Semântico Real:** O Nginx entrega a SPA mantendo o status HTTP `404 Not Found` para rotas inexistentes, enquanto serve os assets estáticos (`/_astro/*`) com `200 OK`.
- **Entrega 100% Estática (Build-Time):** A presença e o destino dos botões de redirecionamento são resolvidos estaticamente no build do Astro. Zero requisições em runtime na página, sem delay e sem efeito de botões dando loading.
- **Animações Fluidas:** Entrada suave do conteúdo e **fade in de baixo para cima** (`animate-fade-in-up`) nos botões com micro-stagger e respeito automático a `prefers-reduced-motion`.
- **Domínio Dinâmico (`GET host/path`):** Identifica em tempo real o subdomínio/rota digitado pelo usuário e sugere links com tolerância a typos via distância Levenshtein.
- **Modularidade Total (Zero Hardcoding):**
  - Defina **apenas `GITHUB_URL`** → renderiza somente o botão do GitHub.
  - Defina **apenas `PORTFOLIO_URL`** → renderiza somente o botão do Portfólio.
  - Defina **ambos** → renderiza os dois botões.
  - **Deixe ambos vazios** → a seção inteira de links é omitida do HTML estático.
- **Easter Egg Secreto no DOM (`hidden` + `<dialog>`):**
  - No HTML existe um bloco `<div id="hacker-secret" hidden>` invisível para visitantes comuns.
  - Se um curioso ou "hacker" abrir o DevTools (`F12`) para xeretar o HTML e remover o atributo `hidden`, o botão discreto **"Estava tentando me hackear?"** é revelado, abrindo um modal estilo mini-terminal com frase, emoji e imagem/GIF customizáveis.

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

### Opção 1: Imagem Oficial Pré-construída

```bash
docker run -d \
  --name 404-page \
  -p 8080:80 \
  ghcr.io/luizgdpulz/404-page:latest
```

### Opção 2: Via `docker-compose.yml`

```yaml
services:
  404-page:
    image: ghcr.io/luizgdpulz/404-page:latest
    container_name: 404-page
    restart: unless-stopped
    expose:
      - "80"
    networks:
      - proxy-net

networks:
  proxy-net:
    external: true
```

### Opção 3: Build Customizado com seus próprios links

```bash
docker build \
  --build-arg PORTFOLIO_URL="https://seu-portfolio.com" \
  --build-arg PORTFOLIO_LABEL="Meu Site" \
  --build-arg GITHUB_URL="https://github.com/seu-user" \
  -t 404-page-custom .
```

---

## 🛠️ Desenvolvimento Local (`pnpm`)

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente de exemplo (opcional)
cp .env.example .env

# Iniciar servidor de desenvolvimento (http://localhost:4321)
pnpm dev

# Gerar build estático de produção (dist/)
pnpm build
```

---

## 📄 Licença

Distribuído sob a licença [MIT](./LICENSE).
