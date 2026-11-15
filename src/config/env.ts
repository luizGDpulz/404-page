export interface AppEnvConfig {
  portfolioUrl: string;
  portfolioLabel: string;
  githubUrl: string;
  githubLabel: string;
  hasPortfolio: boolean;
  hasGithub: boolean;
  hasAnyLink: boolean;
  hackerTriggerText: string;
  hackerEmoji: string;
  hackerMessage: string;
  hackerImageUrl: string;
}

const DEFAULT_PORTFOLIO_URL = 'https://portfolio.pulz.dev.br';
const DEFAULT_PORTFOLIO_LABEL = 'Meu Portfólio';
const DEFAULT_GITHUB_URL = 'https://github.com/luizGDpulz';
const DEFAULT_GITHUB_LABEL = 'GitHub Pessoal';
const DEFAULT_HACKER_TRIGGER = 'Estava tentando me hackear?';
const DEFAULT_HACKER_EMOJI = '🕵️‍♂️';
const DEFAULT_HACKER_MESSAGE =
  "Boa tentativa! Tirar o atributo 'hidden' no DevTools não conta como zero-day, mas ganhou pontos pela curiosidade.";

function readEnv(key: string): string | undefined {
  const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return (import.meta.env[key] as string | undefined) ?? nodeEnv?.[key];
}

function resolveOptional(key: string, fallback: string): string {
  const raw = readEnv(key);
  return (raw !== undefined ? raw : fallback).trim();
}

function resolveRequired(key: string, fallback: string): string {
  const value = resolveOptional(key, fallback);
  return value || fallback;
}

export function getAppEnvConfig(): AppEnvConfig {
  const portfolioUrl = resolveOptional('PORTFOLIO_URL', DEFAULT_PORTFOLIO_URL);
  const portfolioLabel = resolveRequired('PORTFOLIO_LABEL', DEFAULT_PORTFOLIO_LABEL);
  const githubUrl = resolveOptional('GITHUB_URL', DEFAULT_GITHUB_URL);
  const githubLabel = resolveRequired('GITHUB_LABEL', DEFAULT_GITHUB_LABEL);

  const hasPortfolio = Boolean(portfolioUrl);
  const hasGithub = Boolean(githubUrl);

  return {
    portfolioUrl,
    portfolioLabel,
    githubUrl,
    githubLabel,
    hasPortfolio,
    hasGithub,
    hasAnyLink: hasPortfolio || hasGithub,
    hackerTriggerText: resolveRequired('HACKER_TRIGGER_TEXT', DEFAULT_HACKER_TRIGGER),
    hackerEmoji: resolveRequired('HACKER_EMOJI', DEFAULT_HACKER_EMOJI),
    hackerMessage: resolveRequired('HACKER_MESSAGE', DEFAULT_HACKER_MESSAGE),
    hackerImageUrl: resolveOptional('HACKER_IMAGE_URL', ''),
  };
}
