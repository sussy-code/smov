import { APP_VERSION, DISCORD_LINK, GITHUB_LINK } from "./constants";

interface Config {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DISCORD_LINK: string;
  TMDB_READ_API_KEY: string;
  CORS_PROXY_URL: string;
  NORMAL_ROUTER: boolean;
}

export interface RuntimeConfig {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DISCORD_LINK: string;
  TMDB_READ_API_KEY: string;
  NORMAL_ROUTER: boolean;
  PROXY_URLS: string[];
}

const env: Record<keyof Config, undefined | string> = {
  TMDB_READ_API_KEY: import.meta.env.VITE_TMDB_READ_API_KEY,
  APP_VERSION: undefined,
  GITHUB_LINK: undefined,
  DISCORD_LINK: undefined,
  CORS_PROXY_URL: import.meta.env.VITE_CORS_PROXY_URL,
  NORMAL_ROUTER: import.meta.env.VITE_NORMAL_ROUTER,
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

export function assertConfig() {
  const keys: Array<keyof Config> = ["TMDB_READ_API_KEY", "CORS_PROXY_URL"];
  const values = keys.map((key) => {
    const val = getKeyValue(key);
    if (val) return val;
    // eslint-disable-next-line no-alert
    window.alert(`Misconfigured instance, missing key: ${key}`);
    return val;
  });
  if (values.includes(undefined)) throw new Error("Misconfigured instance");
}

export function conf(): RuntimeConfig {
  return {
    APP_VERSION,
    GITHUB_LINK,
    DISCORD_LINK,
    TMDB_READ_API_KEY: getKey("TMDB_READ_API_KEY"),
    PROXY_URLS: getKey("CORS_PROXY_URL")
      .split(",")
      .map((v) => v.trim()),
    NORMAL_ROUTER: getKey("NORMAL_ROUTER", "false") === "true",
  };
}
