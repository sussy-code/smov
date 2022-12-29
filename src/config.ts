import { APP_VERSION, GITHUB_LINK, DISCORD_LINK } from "@/constants";

interface Config {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DISCORD_LINK: string;
  OMDB_API_KEY: string;
  TMDB_API_KEY: string;
  CORS_PROXY_URL: string;
}

export interface RuntimeConfig extends Config {
  BASE_PROXY_URL: string;
}

const env: Record<keyof Config, undefined | string> = {
  OMDB_API_KEY: import.meta.env.VITE_OMDB_API_KEY,
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  APP_VERSION: undefined,
  GITHUB_LINK: undefined,
  DISCORD_LINK: undefined,
  CORS_PROXY_URL: import.meta.env.VITE_CORS_PROXY_URL,
};

const alerts = [] as string[];

// loads from different locations, in order: environment (VITE_{KEY}), window (public/config.js)
function getKey(key: keyof Config): string {
  let windowValue = (window as any)?.__CONFIG__?.[`VITE_${key}`];
  if (windowValue !== undefined && windowValue.length === 0)
    windowValue = undefined;
  const value = env[key] ?? windowValue ?? undefined;
  if (value === undefined) {
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
    BASE_PROXY_URL: getKey("CORS_PROXY_URL"),
    CORS_PROXY_URL: `${getKey("CORS_PROXY_URL")}/?destination=`,
  };
}
