import { FetchOptions, FetchResponse, ofetch } from "ofetch";

import { conf } from "@/setup/config";

let proxyUrlIndex = Math.floor(Math.random() * conf().PROXY_URLS.length);

// round robins all proxy urls
function getProxyUrl(): string {
  const url = conf().PROXY_URLS[proxyUrlIndex];
  proxyUrlIndex = (proxyUrlIndex + 1) % conf().PROXY_URLS.length;
  return url;
}

type P<T> = Parameters<typeof ofetch<T>>;
type R<T> = ReturnType<typeof ofetch<T>>;

const baseFetch = ofetch.create({
  retry: 0,
});

export function makeUrl(url: string, data: Record<string, string>) {
  let parsedUrl: string = url;
  Object.entries(data).forEach(([k, v]) => {
    parsedUrl = parsedUrl.replace(`{${k}}`, encodeURIComponent(v));
  });
  return parsedUrl;
}

export function mwFetch<T>(url: string, ops: P<T>[1] = {}): R<T> {
  return baseFetch<T>(url, ops);
}

export function proxiedFetch<T>(url: string, ops: P<T>[1] = {}): R<T> {
  let combinedUrl = ops?.baseURL ?? "";
  if (
    combinedUrl.length > 0 &&
    combinedUrl.endsWith("/") &&
    url.startsWith("/")
  )
    combinedUrl += url.slice(1);
  else if (
    combinedUrl.length > 0 &&
    !combinedUrl.endsWith("/") &&
    !url.startsWith("/")
  )
    combinedUrl += `/${url}`;
  else combinedUrl += url;

  const parsedUrl = new URL(combinedUrl);
  Object.entries(ops?.params ?? {}).forEach(([k, v]) => {
    parsedUrl.searchParams.set(k, v);
  });

  return baseFetch<T>(getProxyUrl(), {
    ...ops,
    baseURL: undefined,
    params: {
      destination: parsedUrl.toString(),
    },
  });
}

export function rawProxiedFetch<T>(
  url: string,
  ops: FetchOptions = {}
): Promise<FetchResponse<T>> {
  let combinedUrl = ops?.baseURL ?? "";
  if (
    combinedUrl.length > 0 &&
    combinedUrl.endsWith("/") &&
    url.startsWith("/")
  )
    combinedUrl += url.slice(1);
  else if (
    combinedUrl.length > 0 &&
    !combinedUrl.endsWith("/") &&
    !url.startsWith("/")
  )
    combinedUrl += `/${url}`;
  else combinedUrl += url;

  const parsedUrl = new URL(combinedUrl);
  Object.entries(ops?.params ?? {}).forEach(([k, v]) => {
    parsedUrl.searchParams.set(k, v);
  });

  return baseFetch.raw(getProxyUrl(), {
    ...ops,
    baseURL: undefined,
    params: {
      destination: parsedUrl.toString(),
    },
  });
}
