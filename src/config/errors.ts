export type ErrorCode = 404 | 502 | 503 | 504;

export interface ThemePalette {
  accent: string;
  glow: string;
  soft: string;
}

export interface ErrorPageSpec {
  code: ErrorCode;
  pageTitle: string;
  badgeText: string;
  headline: string;
  description: string;
  allowTypoSuggestion: boolean;
  showRetryButton: boolean;
  fixedTheme?: ThemePalette;
}

export const CHAMELEON_THEMES: ThemePalette[] = [
  { accent: '#10b981', glow: 'rgba(16, 185, 129, 0.42)', soft: 'rgba(16, 185, 129, 0.14)' },
  { accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.42)', soft: 'rgba(6, 182, 212, 0.14)' },
  { accent: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.45)', soft: 'rgba(139, 92, 246, 0.15)' },
  { accent: '#f43f5e', glow: 'rgba(244, 63, 94, 0.42)', soft: 'rgba(244, 63, 94, 0.14)' },
  { accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.40)', soft: 'rgba(245, 158, 11, 0.14)' },
  { accent: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)', soft: 'rgba(59, 130, 246, 0.15)' },
  { accent: '#d946ef', glow: 'rgba(217, 70, 239, 0.42)', soft: 'rgba(217, 70, 239, 0.14)' },
];

export const ERROR_SPECS: Record<ErrorCode, ErrorPageSpec> = {
  404: {
    code: 404,
    pageTitle: '404 — Página não encontrada',
    badgeText: 'HTTP 404 // ROUTE_NOT_FOUND',
    headline: 'Parece que você se perdeu!',
    description: 'O endereço que você buscou não existe ou eu quebrei alguma coisa!',
    allowTypoSuggestion: true,
    showRetryButton: false,
  },
  502: {
    code: 502,
    pageTitle: '502 — Serviço temporariamente offline',
    badgeText: 'HTTP 502 // SERVICE_OFFLINE',
    headline: 'Serviço temporariamente offline',
    description:
      'Este endereço existe na infraestrutura, mas o container de destino está parado ou inicializando no momento.',
    allowTypoSuggestion: false,
    showRetryButton: true,
    fixedTheme: {
      accent: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.42)',
      soft: 'rgba(245, 158, 11, 0.14)',
    },
  },
  503: {
    code: 503,
    pageTitle: '503 — Serviço em manutenção',
    badgeText: 'HTTP 503 // SERVICE_UNAVAILABLE',
    headline: 'Serviço em manutenção',
    description:
      'O serviço está temporariamente indisponível para manutenção ou atualização. Tente novamente em instantes.',
    allowTypoSuggestion: false,
    showRetryButton: true,
    fixedTheme: {
      accent: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.42)',
      soft: 'rgba(6, 182, 212, 0.14)',
    },
  },
  504: {
    code: 504,
    pageTitle: '504 — Tempo limite esgotado',
    badgeText: 'HTTP 504 // GATEWAY_TIMEOUT',
    headline: 'O serviço demorou para responder',
    description:
      'O proxy não recebeu resposta a tempo do container de destino. Ele pode estar sobrecarregado ou reiniciando.',
    allowTypoSuggestion: false,
    showRetryButton: true,
    fixedTheme: {
      accent: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.42)',
      soft: 'rgba(244, 63, 94, 0.14)',
    },
  },
};
