import {
  APP_VERSION,
  DISCORD_LINK,
  DONATION_LINK,
  GITHUB_LINK,
} from "./constants";

interface Config {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DONATION_LINK: string;
  DISCORD_LINK: string;
  TMDB_READ_API_KEY: string;
  CORS_PROXY_URL: string;
  NORMAL_ROUTER: boolean;
  BACKEND_URL: string;
}

export interface RuntimeConfig {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DONATION_LINK: string;
  DISCORD_LINK: string;
  TMDB_READ_API_KEY: string;
  NORMAL_ROUTER: boolean;
  PROXY_URLS: string[];
  BACKEND_URL: string;
}

const env: Record<keyof Config, undefined | string> = {
  TMDB_READ_API_KEY: import.meta.env.VITE_TMDB_READ_API_KEY,
  APP_VERSION: undefined,
  GITHUB_LINK: undefined,
  DONATION_LINK: undefined,
  DISCORD_LINK: undefined,
  CORS_PROXY_URL: import.meta.env.VITE_CORS_PROXY_URL,
  NORMAL_ROUTER: import.meta.env.VITE_NORMAL_ROUTER,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
};

// loads from different locations, in order: environment (VITE_{KEY}), window (public/config.js)
function getKeyValue(key: keyof Config): string | undefined {
  let windowValue = (window as any)?.__CONFIG__?.[`VITE_${key}`];
  if (windowValue !== undefined && windowValue.length === 0)
    windowValue = undefined;
  return env[key] ?? windowValue ?? undefined;
}

function getKey(key: keyof Config, defaultString?: string): string {
  return getKeyValue(key) ?? defaultString ?? "";
}

export function conf(): RuntimeConfig {
  return {
    APP_VERSION,
    GITHUB_LINK,
    DONATION_LINK,
    DISCORD_LINK,
    BACKEND_URL: getKey("BACKEND_URL"),
    TMDB_READ_API_KEY: getKey("TMDB_READ_API_KEY"),
    PROXY_URLS: getKey("CORS_PROXY_URL")
      .split(",")
      .map((v) => v.trim()),
    NORMAL_ROUTER: getKey("NORMAL_ROUTER", "false") === "true",
  };
}
