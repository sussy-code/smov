import { MetaOutput, NotFoundError, ScrapeMedia } from "@movie-web/providers";
import { jwtDecode } from "jwt-decode";

import { mwFetch } from "@/backend/helpers/fetch";
import { getTurnstileToken, isTurnstileInitialized } from "@/stores/turnstile";

let metaDataCache: MetaOutput[] | null = null;
let token: null | string = null;

export function setCachedMetadata(data: MetaOutput[]) {
  metaDataCache = data;
}

export function getCachedMetadata(): MetaOutput[] {
  return metaDataCache ?? [];
}

export function setApiToken(newToken: string) {
  token = newToken;
}

function getTokenIfValid(): null | string {
  if (!token) return null;
  try {
    const body = jwtDecode(token);
    if (!body.exp) return `jwt|${token}`;
    if (Date.now() / 1000 < body.exp) return `jwt|${token}`;
  } catch (err) {
    // we dont care about parse errors
  }
  return null;
}

export async function fetchMetadata(base: string) {
  if (metaDataCache) return;
  const data = await mwFetch<MetaOutput[][]>(`${base}/metadata`);
  metaDataCache = data.flat();
}

function scrapeMediaToQueryMedia(media: ScrapeMedia) {
  let extra: Record<string, string> = {};
  if (media.type === "show") {
    extra = {
      episodeNumber: media.episode.number.toString(),
      episodeTmdbId: media.episode.tmdbId,
      seasonNumber: media.season.number.toString(),
      seasonTmdbId: media.season.tmdbId,
    };
  }

  return {
    type: media.type,
    releaseYear: media.releaseYear.toString(),
    imdbId: media.imdbId,
    tmdbId: media.tmdbId,
    title: media.title,
    ...extra,
  };
}

function addQueryDataToUrl(url: URL, data: Record<string, string | undefined>) {
  Object.entries(data).forEach((entry) => {
    if (entry[1]) url.searchParams.set(entry[0], entry[1]);
  });
}

export function makeProviderUrl(base: string) {
  const makeUrl = (p: string) => new URL(`${base}${p}`);
  return {
    scrapeSource(sourceId: string, media: ScrapeMedia) {
      const url = makeUrl("/scrape/source");
      addQueryDataToUrl(url, scrapeMediaToQueryMedia(media));
      addQueryDataToUrl(url, { id: sourceId });
      return url.toString();
    },
    scrapeAll(media: ScrapeMedia) {
      const url = makeUrl("/scrape");
      addQueryDataToUrl(url, scrapeMediaToQueryMedia(media));
      return url.toString();
    },
    scrapeEmbed(embedId: string, embedUrl: string) {
      const url = makeUrl("/scrape/embed");
      addQueryDataToUrl(url, { id: embedId, url: embedUrl });
      return url.toString();
    },
  };
}

export async function getApiToken(): Promise<string | null> {
  let apiToken = getTokenIfValid();
  if (!apiToken && isTurnstileInitialized()) {
    apiToken = `turnstile|${await getTurnstileToken()}`;
  }
  return apiToken;
}

function parseEventInput(inp: string): any {
  if (inp.length === 0) return {};
  return JSON.parse(inp);
}

export async function connectServerSideEvents<T>(
  url: string,
  endEvents: string[],
) {
  const apiToken = await getApiToken();

  // insert token, if its set
  const parsedUrl = new URL(url);
  if (apiToken) parsedUrl.searchParams.set("token", apiToken);
  const eventSource = new EventSource(parsedUrl.toString());

  let promReject: (reason?: any) => void;
  let promResolve: (value: T) => void;
  const promise = new Promise<T>((resolve, reject) => {
    promResolve = resolve;
    promReject = reject;
  });

  endEvents.forEach((evt) => {
    eventSource.addEventListener(evt, (e) => {
      eventSource.close();
      promResolve(parseEventInput(e.data));
    });
  });

  eventSource.addEventListener("token", (e) => {
    setApiToken(parseEventInput(e.data));
  });

  eventSource.addEventListener("error", (err: MessageEvent<any>) => {
    eventSource.close();
    if (err.data) {
      const data = JSON.parse(err.data);
      let errObj = new Error("scrape error");
      if (data.name === NotFoundError.name)
        errObj = new NotFoundError("Notfound from server");
      Object.assign(errObj, data);
      promReject(errObj);
      return;
    }

    console.error("Failed to connect to SSE", err);
    promReject(err);
  });

  eventSource.addEventListener("message", (ev) => {
    if (!ev) {
      eventSource.close();
      return;
    }
    setTimeout(() => {
      promReject(new Error("SSE closed improperly"));
    }, 1000);
  });

  return {
    promise: () => promise,
    on<Data>(event: string, cb: (data: Data) => void) {
      eventSource.addEventListener(event, (e) => cb(JSON.parse(e.data)));
    },
  };
}
