import { MWProviderContext, MWProviderScrapeResult } from "./provider";
import { getEmbedScraperByType, getProviders } from "./register";
import { runEmbedScraper, runProvider } from "./run";
import { MWStream } from "./streams";
import { DetailedMeta } from "../metadata/getmeta";
import { MWMediaType } from "../metadata/types/mw";

interface MWProgressData {
  type: "embed" | "provider";
  id: string;
  eventId: string;
  percentage: number;
  errored: boolean;
}
interface MWNextData {
  id: string;
  eventId: string;
  type: "embed" | "provider";
}

type MWProviderRunContextBase = {
  media: DetailedMeta;
  onProgress?: (data: MWProgressData) => void;
  onNext?: (data: MWNextData) => void;
};
type MWProviderRunContextTypeSpecific =
  | {
      type: MWMediaType.MOVIE | MWMediaType.ANIME;
      episode: undefined;
      season: undefined;
    }
  | {
      type: MWMediaType.SERIES;
      episode: string;
      season: string;
    };

export type MWProviderRunContext = MWProviderRunContextBase &
  MWProviderRunContextTypeSpecific;

async function findBestEmbedStream(
  result: MWProviderScrapeResult,
  providerId: string,
  ctx: MWProviderRunContext
): Promise<MWStream | null> {
  if (result.stream) {
    return {
      ...result.stream,
      providerId,
      embedId: providerId,
    };
  }

  let embedNum = 0;
  for (const embed of result.embeds) {
    embedNum += 1;
    if (!embed.type) continue;
    const scraper = getEmbedScraperByType(embed.type);
    if (!scraper) throw new Error(`Type for embed not found: ${embed.type}`);

    const eventId = [providerId, scraper.id, embedNum].join("|");

    ctx.onNext?.({ id: scraper.id, type: "embed", eventId });

    let stream: MWStream;
    try {
      stream = await runEmbedScraper(scraper, {
        url: embed.url,
        progress(num) {
          ctx.onProgress?.({
            errored: false,
            eventId,
            id: scraper.id,
            percentage: num,
            type: "embed",
          });
        },
      });
    } catch {
      ctx.onProgress?.({
        errored: true,
        eventId,
        id: scraper.id,
        percentage: 100,
        type: "embed",
      });
      continue;
    }

    ctx.onProgress?.({
      errored: false,
      eventId,
      id: scraper.id,
      percentage: 100,
      type: "embed",
    });

    stream.providerId = providerId;
    return stream;
  }

  return null;
}

export async function findBestStream(
  ctx: MWProviderRunContext
): Promise<MWStream | null> {
  const providers = getProviders();

  for (const provider of providers) {
    const eventId = provider.id;
    ctx.onNext?.({ id: provider.id, type: "provider", eventId });
    let result: MWProviderScrapeResult;
    try {
      let context: MWProviderContext;
      if (ctx.type === MWMediaType.SERIES) {
        context = {
          media: ctx.media,
          type: ctx.type,
          episode: ctx.episode,
          season: ctx.season,
          progress(num) {
            ctx.onProgress?.({
              percentage: num,
              eventId,
              errored: false,
              id: provider.id,
              type: "provider",
            });
          },
        };
      } else {
        context = {
          media: ctx.media,
          type: ctx.type,
          progress(num) {
            ctx.onProgress?.({
              percentage: num,
              eventId,
              errored: false,
              id: provider.id,
              type: "provider",
            });
          },
        };
      }
      result = await runProvider(provider, context);
    } catch (err) {
      ctx.onProgress?.({
        percentage: 100,
        errored: true,
        eventId,
        id: provider.id,
        type: "provider",
      });
      continue;
    }

    ctx.onProgress?.({
      errored: false,
      id: provider.id,
      eventId,
      percentage: 100,
      type: "provider",
    });

    const stream = await findBestEmbedStream(result, provider.id, ctx);
    if (!stream) continue;
    return stream;
  }

  return null;
}
