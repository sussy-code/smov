import {
  ProviderBuilderOptions,
  ProviderControls,
  makeProviders,
  makeSimpleProxyFetcher,
  makeStandardFetcher,
  targets,
} from "@movie-web/providers";

import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

const originalUrls = conf().PROXY_URLS;
let fetchersIndex = -1;

export function getLoadbalancedProxyUrl() {
  const fetchers = useAuthStore.getState().proxySet ?? originalUrls;
  if (fetchersIndex === -1 || fetchersIndex >= fetchers.length) {
    fetchersIndex = Math.floor(Math.random() * fetchers.length);
  }
  const proxyUrl = fetchers[fetchersIndex];
  fetchersIndex = (fetchersIndex + 1) % fetchers.length;
  return proxyUrl;
}

function makeLoadBalancedSimpleProxyFetcher() {
  const fetcher: ProviderBuilderOptions["fetcher"] = (a, b) => {
    const currentFetcher = makeSimpleProxyFetcher(
      getLoadbalancedProxyUrl(),
      fetch
    );
    return currentFetcher(a, b);
  };
  return fetcher;
}

export const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeLoadBalancedSimpleProxyFetcher(),
  target: targets.BROWSER,
}) as any as ProviderControls;
