# 404-page

Página de erro **HTTP 404** moderna, responsiva, ultra-leve (`< 10MB RAM`) e 100% modular, construída com **Astro**, **Tailwind CSS** e **TypeScript**, empacotada em container `nginx:alpine`.

Projetada para atuar como *catch-all fallback* elegante em infraestruturas com DNS Wildcard e proxy reverso (Cloudflare + Nginx Proxy Manager).

---

## ✨ Funcionalidades

- **Retorno HTTP 404 Semântico Real:** O Nginx entrega a SPA mantendo o status HTTP `404 Not Found` para rotas inexistentes, enquanto serve os assets estáticos (`/_astro/*`, `/config.json`) com `200 OK`.
- **Domínio Dinâmico (`{domain}`):** Identifica automaticamente o subdomínio/rota que o usuário tentou acessar e injeta na mensagem configurável.
- **Modularidade Total (Zero Hardcoding):**
  - Preencha **apenas `GITHUB_URL`** → renderiza somente o botão do GitHub.
  - Preencha **apenas `PORTFOLIO_URL`** → renderiza somente o botão do Portfólio.
  - Preencha **ambos** → renderiza os dois botões.
  - **Não preencha nenhum** → a seção inteira de links permanece oculta (`hidden`).
- **Easter Egg Secreto no DOM (`hidden` + `<dialog>`):**
  - No HTML existe um bloco `<div id="hacker-secret" hidden>` invisível para visitantes comuns.
  - Se um curioso ou "hacker" abrir o DevTools (`F12`) para xeretar o HTML e remover o atributo `hidden`, o botão discreto **"Estava tentando me hackear?"** é revelado, abrindo um modal estilo mini-terminal com frase, emoji e imagem/GIF customizáveis.
- **Configuração em Runtime:** Injeção dinâmica via variáveis de ambiente no boot do container (`/docker-entrypoint.d/40-generate-config.sh`) ou via volume `config.json` somente-leitura.

---

## 🚀 Como Rodar com Docker

### Opção 1: Via Variáveis de Ambiente (`docker run`)

```bash
docker run -d \
  --name 404-page \
  -p 8080:80 \
  -e PORTFOLIO_URL="https://portfolio.pulz.dev.br" \
  -e GITHUB_URL="https://github.com/luizGDpulz" \
  -e HACKER_MESSAGE="Boa tentativa! Tirar o atributo 'hidden' no DevTools não conta como zero-day 🕵️‍♂️" \
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
    environment:
      PORTFOLIO_URL: "https://portfolio.pulz.dev.br"
      PORTFOLIO_LABEL: "Meu Portfólio"
      GITHUB_URL: "https://github.com/luizGDpulz"
      GITHUB_LABEL: "GitHub Pessoal"
      MESSAGE_TEMPLATE: "Parece que você se perdeu, o endereço que você buscou {domain} não existe ou eu quebrei alguma coisa!"
      HACKER_TRIGGER_TEXT: "Estava tentando me hackear?"
      HACKER_EMOJI: "🕵️‍♂️"
      HACKER_MESSAGE: "Boa tentativa! Tirar o atributo 'hidden' no DevTools não conta como zero-day, mas ganhou pontos pela curiosidade."
      HACKER_IMAGE_URL: ""
    networks:
      - proxy-net

networks:
  proxy-net:
    external: true
```

### Opção 3: Montando um `config.json` customizado

Se preferir montar um arquivo JSON diretamente (como somente-leitura `:ro`), o container respeitará o arquivo montado automaticamente:

```bash
docker run -d \
  --name 404-page \
  -p 8080:80 \
  -v $(pwd)/config.json:/usr/share/nginx/html/config.json:ro \
  ghcr.io/luizgdpulz/404-page:latest
```

---

## ⚙️ Variáveis de Ambiente Suportadas

| Variável | Chave no `config.json` | Descrição | Padrão |
| :--- | :--- | :--- | :--- |
| `PORTFOLIO_URL` | `portfolioUrl` | URL do portfólio (vazio oculta o botão) | `""` |
| `PORTFOLIO_LABEL` | `portfolioLabel` | Texto do botão do portfólio | `"Meu Portfólio"` |
| `GITHUB_URL` | `githubUrl` | URL do GitHub (vazio oculta o botão) | `""` |
| `GITHUB_LABEL` | `githubLabel` | Texto do botão do GitHub | `"GitHub Pessoal"` |
| `MESSAGE_TEMPLATE` | `messageTemplate` | Frase principal (`{domain}` é dinâmico) | `"Parece que você se perdeu, o endereço que você buscou {domain} não existe ou eu quebrei alguma coisa!"` |
| `HACKER_TRIGGER_TEXT` | `hackerTriggerText` | Texto do botão secreto no DOM | `"Estava tentando me hackear?"` |
| `HACKER_EMOJI` | `hackerEmoji` | Emoji exibido no modal secreto | `"🕵️‍♂️"` |
| `HACKER_MESSAGE` | `hackerMessage` | Mensagem exibida no modal secreto | `"Boa tentativa! ..."` |
| `HACKER_IMAGE_URL` | `hackerImageUrl` | URL opcional de imagem/GIF no modal | `""` |

---

## 🛠️ Desenvolvimento Local (`pnpm`)

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento (http://localhost:4321)
pnpm dev

# Gerar build estático de produção (dist/)
pnpm build
```

---

## 📄 Licença

Distribuído sob a licença [MIT](./LICENSE).
