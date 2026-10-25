#!/bin/sh
set -e

CONFIG_PATH="/usr/share/nginx/html/config.json"

# Se o usuário montou um config.json como somente-leitura (:ro), respeita o arquivo montado
if [ -f "$CONFIG_PATH" ] && [ ! -w "$CONFIG_PATH" ]; then
    echo "[404-page] config.json montado como somente-leitura detectado. Mantendo arquivo externo."
    exit 0
fi

escape_json() {
    printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e ':a;N;$!ba;s/\n/\\n/g'
}

PORTFOLIO_URL_ESC=$(escape_json "${PORTFOLIO_URL:-}")
PORTFOLIO_LABEL_ESC=$(escape_json "${PORTFOLIO_LABEL:-Meu Portfólio}")
GITHUB_URL_ESC=$(escape_json "${GITHUB_URL:-}")
GITHUB_LABEL_ESC=$(escape_json "${GITHUB_LABEL:-GitHub Pessoal}")
MESSAGE_TEMPLATE_ESC=$(escape_json "${MESSAGE_TEMPLATE:-Parece que você se perdeu, o endereço que você buscou {domain} não existe ou eu quebrei alguma coisa!}")
HACKER_TRIGGER_TEXT_ESC=$(escape_json "${HACKER_TRIGGER_TEXT:-Estava tentando me hackear?}")
HACKER_EMOJI_ESC=$(escape_json "${HACKER_EMOJI:-🕵️‍♂️}")
HACKER_MESSAGE_ESC=$(escape_json "${HACKER_MESSAGE:-Boa tentativa! Tirar o atributo 'hidden' no DevTools não conta como zero-day, mas ganhou pontos pela curiosidade.}")
HACKER_IMAGE_URL_ESC=$(escape_json "${HACKER_IMAGE_URL:-}")

cat <<EOF > "$CONFIG_PATH"
{
  "portfolioUrl": "${PORTFOLIO_URL_ESC}",
  "portfolioLabel": "${PORTFOLIO_LABEL_ESC}",
  "githubUrl": "${GITHUB_URL_ESC}",
  "githubLabel": "${GITHUB_LABEL_ESC}",
  "messageTemplate": "${MESSAGE_TEMPLATE_ESC}",
  "hackerTriggerText": "${HACKER_TRIGGER_TEXT_ESC}",
  "hackerEmoji": "${HACKER_EMOJI_ESC}",
  "hackerMessage": "${HACKER_MESSAGE_ESC}",
  "hackerImageUrl": "${HACKER_IMAGE_URL_ESC}"
}
EOF

echo "[404-page] Runtime config.json gerado com sucesso."
