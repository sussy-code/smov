import {
  EmbedOutput,
  NotFoundError,
  SourcererOutput,
} from "@movie-web/providers";
import { useAsyncFn } from "react-use";

import { isExtensionActiveCached } from "@/backend/extension/messaging";
import { prepareStream } from "@/backend/extension/streams";
import {
  connectServerSideEvents,
  makeProviderUrl,
} from "@/backend/helpers/providerApi";
import {
  scrapeSourceOutputToProviderMetric,
  useReportProviders,
} from "@/backend/helpers/report";
import { getLoadbalancedProviderApiUrl } from "@/backend/providers/fetchers";
import { getProviders } from "@/backend/providers/providers";
import { convertProviderCaption } from "@/components/player/utils/captions";
import { convertRunoutputToSource } from "@/components/player/utils/convertRunoutputToSource";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { metaToScrapeMedia } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export function useEmbedScraping(
  routerId: string,
  sourceId: string,
  url: string,
  embedId: string,
) {
  const setSource = usePlayerStore((s) => s.setSource);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const setSourceId = usePlayerStore((s) => s.setSourceId);
  const progress = usePlayerStore((s) => s.progress.time);
  const meta = usePlayerStore((s) => s.meta);
  const router = useOverlayRouter(routerId);
  const { report } = useReportProviders();

  const [request, run] = useAsyncFn(async () => {
    const providerApiUrl = getLoadbalancedProviderApiUrl();
    let result: EmbedOutput | undefined;
    if (!meta) return;
    try {
      if (providerApiUrl && !isExtensionActiveCached()) {
        const baseUrlMaker = makeProviderUrl(providerApiUrl);
        const conn = await connectServerSideEvents<EmbedOutput>(
          baseUrlMaker.scrapeEmbed(embedId, url),
          ["completed", "noOutput"],
        );
        result = await conn.promise();
      } else {
        result = await getProviders().runEmbedScraper({
          id: embedId,
          url,
        });
      }
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
          err,
        ),
      ]);
      throw err;
    }
    report([
      scrapeSourceOutputToProviderMetric(meta, sourceId, null, "success", null),
    ]);
    if (isExtensionActiveCached()) await prepareStream(result.stream[0]);
    setSourceId(sourceId);
    setCaption(null);
    setSource(
      convertRunoutputToSource({ stream: result.stream[0] }),
      convertProviderCaption(result.stream[0].captions),
      progress,
    );
    router.close();
  }, [embedId, sourceId, meta, router, report, setCaption]);

  return {
    run,
    loading: request.loading,
    errored: !!request.error,
  };
}

export function useSourceScraping(sourceId: string | null, routerId: string) {
  const meta = usePlayerStore((s) => s.meta);
  const setSource = usePlayerStore((s) => s.setSource);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const setSourceId = usePlayerStore((s) => s.setSourceId);
  const progress = usePlayerStore((s) => s.progress.time);
  const router = useOverlayRouter(routerId);
  const { report } = useReportProviders();

  const [request, run] = useAsyncFn(async () => {
    if (!sourceId || !meta) return null;
    const scrapeMedia = metaToScrapeMedia(meta);
    const providerApiUrl = getLoadbalancedProviderApiUrl();

    let result: SourcererOutput | undefined;
    try {
      if (providerApiUrl && !isExtensionActiveCached()) {
        const baseUrlMaker = makeProviderUrl(providerApiUrl);
        const conn = await connectServerSideEvents<SourcererOutput>(
          baseUrlMaker.scrapeSource(sourceId, scrapeMedia),
          ["completed", "noOutput"],
        );
        result = await conn.promise();
      } else {
        result = await getProviders().runSourceScraper({
          id: sourceId,
          media: scrapeMedia,
        });
      }
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
      if (isExtensionActiveCached()) await prepareStream(result.stream[0]);
      setCaption(null);
      setSource(
        convertRunoutputToSource({ stream: result.stream[0] }),
        convertProviderCaption(result.stream[0].captions),
        progress,
      );
      setSourceId(sourceId);
      router.close();
      return null;
    }
    if (result.embeds.length === 1) {
      let embedResult: EmbedOutput | undefined;
      if (!meta) return;
      try {
        if (providerApiUrl && !isExtensionActiveCached()) {
          const baseUrlMaker = makeProviderUrl(providerApiUrl);
          const conn = await connectServerSideEvents<EmbedOutput>(
            baseUrlMaker.scrapeEmbed(
              result.embeds[0].embedId,
              result.embeds[0].url,
            ),
            ["completed", "noOutput"],
          );
          embedResult = await conn.promise();
        } else {
          embedResult = await getProviders().runEmbedScraper({
            id: result.embeds[0].embedId,
            url: result.embeds[0].url,
          });
        }
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
            err,
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
          null,
        ),
      ]);
      setSourceId(sourceId);
      setCaption(null);
      if (isExtensionActiveCached()) await prepareStream(embedResult.stream[0]);
      setSource(
        convertRunoutputToSource({ stream: embedResult.stream[0] }),
        convertProviderCaption(embedResult.stream[0].captions),
        progress,
      );
      router.close();
    }
    return result.embeds;
  }, [sourceId, meta, router, setCaption]);

  return {
    run,
    watching: (request.value ?? null) === null,
    loading: request.loading,
    items: request.value,
    notfound: !!(request.error instanceof NotFoundError),
    errored: !!request.error,
  };
}
