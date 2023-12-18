import { ScrapeMedia } from "@movie-web/providers";

function scrapeMediaToQueryMedia(media: ScrapeMedia) {
  let extra: Record<string, string> = {};
  if (media.type === "show") {
    extra = {
      episodeNumber: media.episode.number.toString(),
      episodeTmdbId: media.episode.tmdbId,
      seasonNumber: media.season.number.toString(),
      seasonTmdbId: media.season.tmdbId,
    };
  }

  return {
    type: media.type,
    releaseYear: media.releaseYear.toString(),
    imdbId: media.imdbId,
    title: media.title,
    ...extra,
  };
}

function addQueryDataToUrl(url: URL, data: Record<string, string | undefined>) {
  Object.entries(data).forEach((entry) => {
    if (entry[1]) url.searchParams.set(entry[0], entry[1]);
  });
}

export function makeProviderUrl(base: string) {
  const makeUrl = (p: string) => new URL(`${base}${p}`);
  return {
    scrapeSource(sourceId: string, media: ScrapeMedia) {
      const url = makeUrl("/scrape/source");
      addQueryDataToUrl(url, scrapeMediaToQueryMedia(media));
      addQueryDataToUrl(url, { id: sourceId });
      return url.toString();
    },
    scrapeAll(media: ScrapeMedia) {
      const url = makeUrl("/scrape");
      addQueryDataToUrl(url, scrapeMediaToQueryMedia(media));
      return url.toString();
    },
    scrapeEmbed(embedId: string, embedUrl: string) {
      const url = makeUrl("/scrape/embed");
      addQueryDataToUrl(url, { id: embedId, url: embedUrl });
      return url.toString();
    },
  };
}

export function connectServerSideEvents(url: string, endEvents: string[]) {
  const;

  return {};
}
