import { Fetcher, makeSimpleProxyFetcher } from "@movie-web/providers";

import { sendExtensionRequest } from "@/backend/extension/messaging";
import { getApiToken, setApiToken } from "@/backend/helpers/providerApi";
import { getProviderApiUrls, getProxyUrls } from "@/utils/proxyUrls";

import { ExtensionMakeRequestBodyType } from "../extension/plasmo";

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

function getBodyTypeFromBody(body: any): ExtensionMakeRequestBodyType {
  if (typeof body === "string") return "string";
  if (body instanceof FormData) return "FormData";
  if (body instanceof URLSearchParams) return "URLSearchParams";
  if (typeof body === "object") return "Object";
  return "string";
}

function convertBodyToObject(body: any): Record<string, any> {
  if (body instanceof FormData) {
    const obj: Record<string, any> = {};
    for (const [key, value] of body.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  if (body instanceof URLSearchParams) {
    const obj: Record<string, any> = {};
    for (const [key, value] of body.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  return body;
}

export function makeExtensionFetcher() {
  const fetcher: Fetcher = async (url, ops) => {
    const opsWithoutBody = { ...ops, body: undefined };
    const result = (await sendExtensionRequest<any>({
      url,
      ...opsWithoutBody,
      ...(ops.body && {
        body: {
          bodyType: getBodyTypeFromBody(ops.body),
          value: convertBodyToObject(ops.body) as any,
        },
      }),
    })) as any;
    if (!result?.success) throw new Error(`extension error: ${result?.error}`);
    console.log(result);
    const res = result.response;
    return {
      body: res.body,
      finalUrl: res.finalUrl,
      statusCode: res.statusCode,
      headers: makeFinalHeaders(ops.readHeaders, res.headers),
    };
  };
  return fetcher;
}
