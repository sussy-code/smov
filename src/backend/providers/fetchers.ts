import { Fetcher, makeSimpleProxyFetcher } from "@movie-web/providers";

import { setDomainRule } from "@/backend/extension/messaging";
import { getApiToken, setApiToken } from "@/backend/helpers/providerApi";
import { getProviderApiUrls, getProxyUrls } from "@/utils/proxyUrls";

import { makeFullUrl } from "./utils";

function makeLoadbalancedList(getter: () => string[]) {
  let listIndex = -1;
  return () => {
    const fetchers = getter();
    if (listIndex === -1 || listIndex >= fetchers.length) {
      listIndex = Math.floor(Math.random() * fetchers.length);
    }
    const proxyUrl = fetchers[listIndex];
    listIndex = (listIndex + 1) % fetchers.length;
    return proxyUrl;
  };
}

export const getLoadbalancedProxyUrl = makeLoadbalancedList(getProxyUrls);
export const getLoadbalancedProviderApiUrl =
  makeLoadbalancedList(getProviderApiUrls);

async function fetchButWithApiTokens(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
): Promise<Response> {
  const apiToken = await getApiToken();
  const headers = new Headers(init?.headers);
  if (apiToken) headers.set("X-Token", apiToken);
  const response = await fetch(
    input,
    init
      ? {
          ...init,
          headers,
        }
      : undefined,
  );
  const newApiToken = response.headers.get("X-Token");
  if (newApiToken) setApiToken(newApiToken);
  return response;
}

export function makeLoadBalancedSimpleProxyFetcher() {
  const fetcher: Fetcher = async (a, b) => {
    const currentFetcher = makeSimpleProxyFetcher(
      getLoadbalancedProxyUrl(),
      fetchButWithApiTokens,
    );
    return currentFetcher(a, b);
  };
  return fetcher;
}

function makeFinalHeaders(
  readHeaders: string[],
  headers: Record<string, string>,
): Headers {
  const lowercasedHeaders = readHeaders.map((v) => v.toLowerCase());
  return new Headers(
    Object.entries(headers).filter((entry) =>
      lowercasedHeaders.includes(entry[0].toLowerCase()),
    ),
  );
}

export function makeExtensionFetcher() {
  const fetcher: Fetcher = async (url, ops) => {
    const fullUrl = makeFullUrl(url, ops);
    const res = await setDomainRule({
      ruleId: 1,
      targetDomains: [fullUrl],
      requestHeaders: ops.headers,
    });
    console.log(res, fullUrl);
    const response = await fetch(fullUrl, {
      method: ops.method,
      headers: ops.headers,
      body: ops.body as any,
    });
    const contentType = response.headers.get("content-type");
    const body = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      body,
      finalUrl: response.url,
      statusCode: response.status,
      headers: makeFinalHeaders(
        ops.readHeaders,
        Object.fromEntries(response.headers.entries()),
      ),
    };
  };
  return fetcher;
}
