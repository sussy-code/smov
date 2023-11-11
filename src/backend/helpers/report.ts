import { ScrapeMedia } from "@movie-web/providers";
import { ofetch } from "ofetch";
import { useCallback } from "react";

import { ScrapingItems, ScrapingSegment } from "@/hooks/useProviderScrape";

const metricsEndpoint = "https://backend.movie-web.app/metrics/providers";

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
  hostname?: string;
};

export async function reportProviders(items: ProviderMetric[]): Promise<void> {
  return ofetch(metricsEndpoint, {
    method: "POST",
    body: {
      items: items.map((v) => ({
        ...v,
        hostname: window.location.hostname,
      })),
    },
  });
}

const segmentStatusMap: Record<
  ScrapingSegment["status"],
  ProviderMetric["status"] | null
> = {
  success: "success",
  notfound: "notfound",
  failure: "failed",
  pending: null,
  waiting: null,
};

export function scrapeSegmentToProviderMetric(
  media: ScrapeMedia,
  providerId: string,
  segment: ScrapingSegment
): ProviderMetric | null {
  const status = segmentStatusMap[segment.status];
  if (!status) return null;
  let episodeId: string | undefined;
  let seasonId: string | undefined;
  if (media.type === "show") {
    episodeId = media.episode.tmdbId;
    seasonId = media.season.tmdbId;
  }
  let error: undefined | Error;
  if (segment.error instanceof Error) error = segment.error;

  return {
    status,
    providerId,
    title: media.title,
    tmdbId: media.tmdbId,
    type: media.type,
    embedId: segment.embedId,
    episodeId,
    seasonId,
    errorMessage: segment.reason ?? error?.message,
    fullError: error
      ? `${error.toString()}\n\n${error.stack ?? ""}`
      : undefined,
  };
}

export function scrapePartsToProviderMetric(
  media: ScrapeMedia,
  order: ScrapingItems[],
  sources: Record<string, ScrapingSegment>
): ProviderMetric[] {
  const output: ProviderMetric[] = [];

  order.forEach((orderItem) => {
    const source = sources[orderItem.id];
    orderItem.children.forEach((embedId) => {
      const embed = sources[embedId];
      if (!embed.embedId) return;
      const metric = scrapeSegmentToProviderMetric(media, source.id, embed);
      if (!metric) return;
      output.push(metric);
    });

    const metric = scrapeSegmentToProviderMetric(media, source.id, source);
    if (!metric) return;
    output.push(metric);
  });

  return output;
}

export function useReportProviders() {
  const report = useCallback((items: ProviderMetric[]) => {
    reportProviders(items);
  }, []);

  return { report };
}
