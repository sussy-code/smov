import { ofetch } from "ofetch";
import { useCallback } from "react";

import { useBackendUrl } from "@/hooks/auth/useBackendUrl";
import { ScrapingSegment } from "@/hooks/useProviderScrape";

export type ProviderMetric = {
  tmdbId: string;
  type: string;
  title: string;
  seasonId?: string;
  episodeId?: string;
  status: "failed" | "notfound" | "success";
  providerId: string;
  embedId?: string;
  errorMessage?: string;
  fullError?: string;
};

export async function reportProviders(
  url: string,
  items: ProviderMetric[]
): Promise<void> {
  return ofetch("/metrics/providers", {
    method: "POST",
    body: {
      items,
    },
    baseURL: url,
  });
}

export function scrapSegmentToProviderMetric(
  _segment: ScrapingSegment
): ProviderMetric {
  // TODO actually convert this
  return {} as any;
}

export function useReportProviders() {
  const url = useBackendUrl();
  // TODO constant url
  const report = useCallback(
    (items: ProviderMetric[]) => {
      reportProviders(url, items);
    },
    [url]
  );

  return { report };
}
