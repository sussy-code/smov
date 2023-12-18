import {
  ProviderBuilderOptions,
  ProviderControls,
  makeProviders,
  makeSimpleProxyFetcher,
  makeStandardFetcher,
  targets,
} from "@movie-web/providers";

import { getProviderApiUrls, getProxyUrls } from "@/utils/proxyUrls";

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

const getLoadbalancedProxyUrl = makeLoadbalancedList(getProxyUrls);
export const getLoadbalancedProviderApiUrl =
  makeLoadbalancedList(getProviderApiUrls);

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
