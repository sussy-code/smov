import { APP_VERSION, GITHUB_LINK, DISCORD_LINK } from "./constants";

interface Config {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DISCORD_LINK: string;
  OMDB_API_KEY: string;
  TMDB_API_KEY: string;
  CORS_PROXY_URL: string;
  NORMAL_ROUTER: boolean;
}

export interface RuntimeConfig {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DISCORD_LINK: string;
  OMDB_API_KEY: string;
  TMDB_API_KEY: string;
  NORMAL_ROUTER: boolean;
  PROXY_URLS: string[];
}

const env: Record<keyof Config, undefined | string> = {
  OMDB_API_KEY: import.meta.env.VITE_OMDB_API_KEY,
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  APP_VERSION: undefined,
  GITHUB_LINK: undefined,
  DISCORD_LINK: undefined,
  CORS_PROXY_URL: import.meta.env.VITE_CORS_PROXY_URL,
  NORMAL_ROUTER: import.meta.env.VITE_NORMAL_ROUTER,
};

const alerts = [] as string[];

// loads from different locations, in order: environment (VITE_{KEY}), window (public/config.js)
function getKey(key: keyof Config, defaultString?: string): string {
  let windowValue = (window as any)?.__CONFIG__?.[`VITE_${key}`];
  if (windowValue !== undefined && windowValue.length === 0)
    windowValue = undefined;
  const value = env[key] ?? windowValue ?? undefined;
  if (value === undefined) {
    if (defaultString) return defaultString;
    if (!alerts.includes(key)) {
      // eslint-disable-next-line no-alert
      window.alert(`Misconfigured instance, missing key: ${key}`);
      alerts.push(key);
    }
    return "";
  }

  return value;
}

export function conf(): RuntimeConfig {
  return {
    APP_VERSION,
    GITHUB_LINK,
    DISCORD_LINK,
    OMDB_API_KEY: getKey("OMDB_API_KEY"),
    TMDB_API_KEY: getKey("TMDB_API_KEY"),
    PROXY_URLS: getKey("CORS_PROXY_URL")
      .split(",")
      .map((v) => v.trim()),
    NORMAL_ROUTER: getKey("NORMAL_ROUTER", "false") === "true",
  };
}
