import {
  EmbedOutput,
  NotFoundError,
  SourcererOutput,
} from "@movie-web/providers";
import { useAsyncFn } from "react-use";

import {
  scrapeSourceOutputToProviderMetric,
  useReportProviders,
} from "@/backend/helpers/report";
import { convertRunoutputToSource } from "@/components/player/utils/convertRunoutputToSource";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { metaToScrapeMedia } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";
import { providers } from "@/utils/providers";

export function useEmbedScraping(
  routerId: string,
  sourceId: string,
  url: string,
  embedId: string
) {
  const setSource = usePlayerStore((s) => s.setSource);
  const setSourceId = usePlayerStore((s) => s.setSourceId);
  const progress = usePlayerStore((s) => s.progress.time);
  const meta = usePlayerStore((s) => s.meta);
  const router = useOverlayRouter(routerId);
  const { report } = useReportProviders();

  const [request, run] = useAsyncFn(async () => {
    let result: EmbedOutput | undefined;
    if (!meta) return;
    try {
      result = await providers.runEmbedScraper({
        id: embedId,
        url,
      });
    } catch (err) {
      console.error(`Failed to scrape ${embedId}`, err);
      const notFound = err instanceof NotFoundError;
      const status = notFound ? "notfound" : "failed";
      report([
        scrapeSourceOutputToProviderMetric(
          meta,
          sourceId,
          embedId,
          status,
          err
        ),
      ]);
      throw err;
    }
    report([
      scrapeSourceOutputToProviderMetric(meta, sourceId, null, "success", null),
    ]);
    setSourceId(sourceId);
    setSource(convertRunoutputToSource({ stream: result.stream }), progress);
    router.close();
  }, [embedId, sourceId, meta, router, report]);

  return {
    run,
    loading: request.loading,
    errored: !!request.error,
  };
}

export function useSourceScraping(sourceId: string | null, routerId: string) {
  const meta = usePlayerStore((s) => s.meta);
  const setSource = usePlayerStore((s) => s.setSource);
  const setSourceId = usePlayerStore((s) => s.setSourceId);
  const progress = usePlayerStore((s) => s.progress.time);
  const router = useOverlayRouter(routerId);
  const { report } = useReportProviders();

  const [request, run] = useAsyncFn(async () => {
    if (!sourceId || !meta) return null;
    const scrapeMedia = metaToScrapeMedia(meta);

    let result: SourcererOutput | undefined;
    try {
      result = await providers.runSourceScraper({
        id: sourceId,
        media: scrapeMedia,
      });
    } catch (err) {
      console.error(`Failed to scrape ${sourceId}`, err);
      const notFound = err instanceof NotFoundError;
      const status = notFound ? "notfound" : "failed";
      report([
        scrapeSourceOutputToProviderMetric(meta, sourceId, null, status, err),
      ]);
      throw err;
    }
    report([
      scrapeSourceOutputToProviderMetric(meta, sourceId, null, "success", null),
    ]);

    if (result.stream) {
      setSource(convertRunoutputToSource({ stream: result.stream }), progress);
      setSourceId(sourceId);
      router.close();
      return null;
    }
    if (result.embeds.length === 1) {
      let embedResult: EmbedOutput | undefined;
      if (!meta) return;
      try {
        embedResult = await providers.runEmbedScraper({
          id: result.embeds[0].embedId,
          url: result.embeds[0].url,
        });
      } catch (err) {
        console.error(`Failed to scrape ${result.embeds[0].embedId}`, err);
        const notFound = err instanceof NotFoundError;
        const status = notFound ? "notfound" : "failed";
        report([
          scrapeSourceOutputToProviderMetric(
            meta,
            sourceId,
            result.embeds[0].embedId,
            status,
            err
          ),
        ]);
        throw err;
      }
      report([
        scrapeSourceOutputToProviderMetric(
          meta,
          sourceId,
          result.embeds[0].embedId,
          "success",
          null
        ),
      ]);
      setSourceId(sourceId);
      setSource(
        convertRunoutputToSource({ stream: embedResult.stream }),
        progress
      );
      router.close();
    }
    return result.embeds;
  }, [sourceId, meta, router]);

  return {
    run,
    watching: (request.value ?? null) === null,
    loading: request.loading,
    items: request.value,
    notfound: !!(request.error instanceof NotFoundError),
    errored: !!request.error,
  };
}
