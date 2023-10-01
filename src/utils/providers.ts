import {
  ProviderBuilderOptions,
  ProviderControls,
  makeProviders,
  makeSimpleProxyFetcher,
  makeStandardFetcher,
  targets,
} from "@movie-web/providers";

import { conf } from "@/setup/config";

const urls = conf().PROXY_URLS;
const fetchers = urls.map((v) => makeSimpleProxyFetcher(v, fetch));
let fetchersIndex = Math.floor(Math.random() * fetchers.length);

function makeLoadBalancedSimpleProxyFetcher() {
  const fetcher: ProviderBuilderOptions["fetcher"] = (a, b) => {
    fetchersIndex += 1 % fetchers.length;
    return fetchers[fetchersIndex](a, b);
  };
  return fetcher;
}

export const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeLoadBalancedSimpleProxyFetcher(),
  target: targets.BROWSER,
}) as any as ProviderControls;
