import { proxiedFetch } from "../helpers/fetch";
import { MWProviderContext } from "../helpers/provider";
import { registerProvider } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";
import { MWMediaType } from "../metadata/types/mw";

const hdwatchedBase = "https://www.hdwatched.xyz";

const qualityMap: Record<number, MWStreamQuality> = {
  360: MWStreamQuality.Q360P,
  540: MWStreamQuality.Q540P,
  480: MWStreamQuality.Q480P,
  720: MWStreamQuality.Q720P,
  1080: MWStreamQuality.Q1080P,
};

interface SearchRes {
  title: string;
  year?: number;
  href: string;
  id: string;
}

function getStreamFromEmbed(stream: string) {
  const embedPage = new DOMParser().parseFromString(stream, "text/html");
  const source = embedPage.querySelector("#vjsplayer > source");
  if (!source) {
    throw new Error("Unable to fetch stream");
  }

  const streamSrc = source.getAttribute("src");
  const streamRes = source.getAttribute("res");

  if (!streamSrc || !streamRes) throw new Error("Unable to find stream");

  return {
    streamUrl: streamSrc,
    quality:
      streamRes && typeof +streamRes === "number"
        ? qualityMap[+streamRes]
        : MWStreamQuality.QUNKNOWN,
  };
}

async function fetchMovie(targetSource: SearchRes) {
  const stream = await proxiedFetch<any>(`/embed/${targetSource.id}`, {
    baseURL: hdwatchedBase,
  });

  const embedPage = new DOMParser().parseFromString(stream, "text/html");
  const source = embedPage.querySelector("#vjsplayer > source");
  if (!source) {
    throw new Error("Unable to fetch movie stream");
  }

  return getStreamFromEmbed(stream);
}

async function fetchSeries(
  targetSource: SearchRes,
  { media, episode, progress }: MWProviderContext
) {
  if (media.meta.type !== MWMediaType.SERIES)
    throw new Error("Media type mismatch");

  const seasonNumber = media.meta.seasonData.number;
  const episodeNumber = media.meta.seasonData.episodes.find(
    (e) => e.id === episode
  )?.number;

  if (!seasonNumber || !episodeNumber)
    throw new Error("Unable to get season or episode number");

  const seriesPage = await proxiedFetch<any>(
    `${targetSource.href}?season=${media.meta.seasonData.number}`,
    {
      baseURL: hdwatchedBase,
    }
  );

  const seasonPage = new DOMParser().parseFromString(seriesPage, "text/html");
  const pageElements = seasonPage.querySelectorAll("div.i-container");

  const seriesList: SearchRes[] = [];
  pageElements.forEach((pageElement) => {
    const href = pageElement.querySelector("a")?.getAttribute("href") || "";
    const title =
      pageElement?.querySelector("span.content-title")?.textContent || "";

    seriesList.push({
      title,
      href,
      id: href.split("/")[2], // Format: /free/{id}/{series-slug}-season-{season-number}-episode-{episode-number}
    });
  });

  const targetEpisode = seriesList.find(
    (episodeEl) =>
      episodeEl.title.trim().toLowerCase() === `episode ${episodeNumber}`
  );

  if (!targetEpisode) throw new Error("Unable to find episode");

  progress(70);

  const stream = await proxiedFetch<any>(`/embed/${targetEpisode.id}`, {
    baseURL: hdwatchedBase,
  });

  const embedPage = new DOMParser().parseFromString(stream, "text/html");
  const source = embedPage.querySelector("#vjsplayer > source");
  if (!source) {
    throw new Error("Unable to fetch movie stream");
  }

  return getStreamFromEmbed(stream);
}

registerProvider({
  id: "hdwatched",
  displayName: "HDwatched",
  rank: 150,
  disabled: true, // very slow, haven't seen it work for a while
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  async scrape(options) {
    const { media, progress } = options;
    if (!media.imdbId) throw new Error("not enough info");
    if (!this.type.includes(media.meta.type)) {
      throw new Error("Unsupported type");
    }

    const search = await proxiedFetch<any>(`/search/${media.imdbId}`, {
      baseURL: hdwatchedBase,
    });

    const searchPage = new DOMParser().parseFromString(search, "text/html");
    const pageElements = searchPage.querySelectorAll("div.i-container");

    const searchList: SearchRes[] = [];
    pageElements.forEach((pageElement) => {
      const href = pageElement.querySelector("a")?.getAttribute("href") || "";
      const title =
        pageElement?.querySelector("span.content-title")?.textContent || "";
      const year =
        parseInt(
          pageElement
            ?.querySelector("div.duration")
            ?.textContent?.trim()
            ?.split(" ")
            ?.pop() || "",
          10
        ) || 0;

      searchList.push({
        title,
        year,
        href,
        id: href.split("/")[2], // Format: /free/{id}/{movie-slug} or /series/{id}/{series-slug}
      });
    });

    progress(20);

    const targetSource = searchList.find(
      (source) => source.year === (media.meta.year ? +media.meta.year : 0) // Compare year to make the search more robust
    );

    if (!targetSource) {
      throw new Error("Could not find stream");
    }

    progress(40);

    if (media.meta.type === MWMediaType.SERIES) {
      const series = await fetchSeries(targetSource, options);
      return {
        embeds: [],
        stream: {
          streamUrl: series.streamUrl,
          quality: series.quality,
          type: MWStreamType.MP4,
          captions: [],
        },
      };
    }

    const movie = await fetchMovie(targetSource);
    return {
      embeds: [],
      stream: {
        streamUrl: movie.streamUrl,
        quality: movie.quality,
        type: MWStreamType.MP4,
        captions: [],
      },
    };
  },
});
