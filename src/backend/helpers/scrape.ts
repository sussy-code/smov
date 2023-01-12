import { MWProviderScrapeResult } from "./provider";
import { getEmbedScraperByType, getProviders } from "./register";
import { runEmbedScraper, runProvider } from "./run";
import { MWStream } from "./streams";

interface MWProgressData {
  type: "embed" | "provider";
  id: string;
  percentage: number;
  errored: boolean;
}
interface MWNextData {
  id: string;
  type: "embed" | "provider";
}

export interface MWProviderRunContext {
  tmdb: string;
  imdb: string;
  onProgress?: (data: MWProgressData) => void;
  onNext?: (data: MWNextData) => void;
}

async function findBestEmbedStream(
  result: MWProviderScrapeResult,
  ctx: MWProviderRunContext
): Promise<MWStream | null> {
  if (result.stream) return result.stream;

  for (const embed of result.embeds) {
    if (!embed.type) continue;
    const scraper = getEmbedScraperByType(embed.type);
    if (!scraper) throw new Error("Type for embed not found");

    ctx.onNext?.({ id: scraper.id, type: "embed" });

    let stream: MWStream;
    try {
      stream = await runEmbedScraper(scraper, {
        url: embed.url,
        progress(num) {
          ctx.onProgress?.({
            errored: false,
            id: scraper.id,
            percentage: num,
            type: "embed",
          });
        },
      });
    } catch {
      ctx.onProgress?.({
        errored: true,
        id: scraper.id,
        percentage: 100,
        type: "embed",
      });
      continue;
    }

    ctx.onProgress?.({
      errored: false,
      id: scraper.id,
      percentage: 100,
      type: "embed",
    });

    return stream;
  }

  return null;
}

export async function findBestStream(
  ctx: MWProviderRunContext
): Promise<MWStream | null> {
  const providers = getProviders();

  for (const provider of providers) {
    ctx.onNext?.({ id: provider.id, type: "provider" });
    let result: MWProviderScrapeResult;
    try {
      result = await runProvider(provider, {
        imdbId: ctx.imdb,
        tmdbId: ctx.tmdb,
        progress(num) {
          ctx.onProgress?.({
            percentage: num,
            errored: false,
            id: provider.id,
            type: "provider",
          });
        },
      });
    } catch (err) {
      ctx.onProgress?.({
        percentage: 100,
        errored: true,
        id: provider.id,
        type: "provider",
      });
      continue;
    }

    ctx.onProgress?.({
      errored: false,
      id: provider.id,
      percentage: 100,
      type: "provider",
    });

    const stream = await findBestEmbedStream(result, ctx);
    if (!stream) continue;
    return stream;
  }

  return null;
}
