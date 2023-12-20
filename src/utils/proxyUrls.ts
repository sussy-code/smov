import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

const originalUrls = conf().PROXY_URLS;
const types = ["proxy", "api"] as const;

type ParsedUrlType = (typeof types)[number];

export interface ParsedUrl {
  url: string;
  type: ParsedUrlType;
}

function canParseUrl(url: string): boolean {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
}

function isParsedUrlType(type: string): type is ParsedUrlType {
  return types.includes(type as any);
}

/**
 * Turn a string like "a=b;c=d;d=e" into a dictionary object
 */
function parseParams(input: string): Record<string, string> {
  const entriesParams = input
    .split(";")
    .map((param) => param.split("=", 2).filter((part) => part.length !== 0))
    .filter((v) => v.length === 2);
  return Object.fromEntries(entriesParams);
}

export function getParsedUrls() {
  const urls = useAuthStore.getState().proxySet ?? originalUrls;
  const output: ParsedUrl[] = [];
  urls.forEach((url) => {
    if (!url.startsWith("|")) {
      if (canParseUrl(url)) {
        output.push({
          url,
          type: "proxy",
        });
        return;
      }
    }

    const match = /^\|([^|]+)\|(.*)$/g.exec(url);
    if (!match || !match[2]) return;
    if (!canParseUrl(match[2])) return;
    const params = parseParams(match[1]);
    const type = params.type ?? "proxy";

    if (!isParsedUrlType(type)) return;
    output.push({
      url: match[2],
      type,
    });
  });

  return output;
}

export function getProxyUrls() {
  return getParsedUrls()
    .filter((v) => v.type === "proxy")
    .map((v) => v.url);
}

export function getProviderApiUrls() {
  return getParsedUrls()
    .filter((v) => v.type === "api")
    .map((v) => v.url);
}
