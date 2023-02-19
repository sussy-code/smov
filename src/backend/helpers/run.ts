import { MWEmbed, MWEmbedContext, MWEmbedScraper } from "./embed";
import {
  MWProvider,
  MWProviderContext,
  MWProviderScrapeResult,
} from "./provider";
import { getEmbedScraperByType } from "./register";
import { MWStream } from "./streams";

function sortProviderResult(
  ctx: MWProviderScrapeResult
): MWProviderScrapeResult {
  ctx.embeds = ctx.embeds
    .map<[MWEmbed, MWEmbedScraper | null]>((v) => [
      v,
      v.type ? getEmbedScraperByType(v.type) : null,
    ])
    .sort(([, a], [, b]) => (b?.rank ?? 0) - (a?.rank ?? 0))
    .map((v) => v[0]);
  return ctx;
}

export async function runProvider(
  provider: MWProvider,
  ctx: MWProviderContext
): Promise<MWProviderScrapeResult> {
  try {
    const data = await provider.scrape(ctx);
    return sortProviderResult(data);
  } catch (err) {
    console.error("Failed to run provider", err, {
      id: provider.id,
      ctx: { ...ctx },
    });
    throw err;
  }
}

export async function runEmbedScraper(
  scraper: MWEmbedScraper,
  ctx: MWEmbedContext
): Promise<MWStream> {
  try {
    return await scraper.getStream(ctx);
  } catch (err) {
    console.error("Failed to run embed scraper", {
      id: scraper.id,
      ctx: { ...ctx },
    });
    throw err;
  }
}
