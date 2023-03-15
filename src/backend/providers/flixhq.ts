import { compareTitle } from "@/utils/titleMatch";
import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "../helpers/streams";
import { MWMediaType } from "../metadata/types";

// const flixHqBase = "https://api.consumet.org/movies/flixhq";
// *** TEMPORARY FIX - use other instance
// SEE ISSUE: https://github.com/consumet/api.consumet.org/issues/326
const flixHqBase = "https://c.delusionz.xyz/movies/flixhq";

interface FLIXMediaBase {
  id: number;
  title: string;
  url: string;
  image: string;
  type: "Movie" | "TV Series";
}

interface FLIXTVSerie extends FLIXMediaBase {
  seasons: number | null;
}

interface FLIXMovie extends FLIXMediaBase {
  releaseDate: string;
}

function castSubtitles({ url, lang }: { url: string; lang: string }) {
  return {
    url,
    langIso: lang,
    type:
      url.substring(url.length - 3) === "vtt"
        ? MWCaptionType.VTT
        : MWCaptionType.SRT,
  };
}

const qualityMap: Record<string, MWStreamQuality> = {
  "360": MWStreamQuality.Q360P,
  "540": MWStreamQuality.Q540P,
  "480": MWStreamQuality.Q480P,
  "720": MWStreamQuality.Q720P,
  "1080": MWStreamQuality.Q1080P,
};

registerProvider({
  id: "flixhq",
  displayName: "FlixHQ",
  rank: 100,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, episode, progress }) {
    if (!this.type.includes(media.meta.type)) {
      throw new Error("Unsupported type");
    }
    // search for relevant item
    const searchResults = await proxiedFetch<any>(
      `/${encodeURIComponent(media.meta.title)}`,
      {
        baseURL: flixHqBase,
      }
    );

    const foundItem = searchResults.results.find((v: FLIXMediaBase) => {
      if (media.meta.type === MWMediaType.MOVIE) {
        if (v.type !== "Movie") return false;
        const movie = v as FLIXMovie;
        return (
          compareTitle(movie.title, media.meta.title) &&
          movie.releaseDate === media.meta.year
        );
      }
      if (media.meta.type === MWMediaType.SERIES) {
        if (v.type !== "TV Series") return false;
        const serie = v as FLIXTVSerie;
        if (serie.seasons && media.meta.seasons) {
          return (
            compareTitle(serie.title, media.meta.title) &&
            serie.seasons === media.meta.seasons.length
          );
        }
        return false;
      }
      return false;
    });
    if (!foundItem) throw new Error("No watchable item found");
    const flixId = foundItem.id;

    // get media info
    progress(25);
    const mediaInfo = await proxiedFetch<any>("/info", {
      baseURL: flixHqBase,
      params: {
        id: flixId,
      },
    });
    if (!mediaInfo.episodes) throw new Error("No watchable item found");
    // get stream info from media
    progress(75);

    // By default we assume it is a movie
    let episodeId: string | undefined = mediaInfo.episodes[0].id;
    if (media.meta.type === MWMediaType.SERIES) {
      const seasonNo = media.meta.seasonData.number;
      const episodeNo = media.meta.seasonData.episodes.find(
        (e) => e.id === episode
      )?.number;
      episodeId = mediaInfo.episodes.find(
        (e: any) => e.season === seasonNo && e.number === episodeNo
      )?.id;
    }
    if (!episodeId) throw new Error("No watchable item found");

    const watchInfo = await proxiedFetch<any>("/watch", {
      baseURL: flixHqBase,
      params: {
        episodeId,
        mediaId: flixId,
      },
    });

    if (!watchInfo.sources) throw new Error("No watchable item found");

    // get best quality source
    // comes sorted by quality in descending order
    const source = watchInfo.sources[0];
    return {
      embeds: [],
      stream: {
        streamUrl: source.url,
        quality: qualityMap[source.quality],
        type: source.isM3U8 ? MWStreamType.HLS : MWStreamType.MP4,
        captions: watchInfo.subtitles
          .filter(
            (x: { url: string; lang: string }) => !x.lang.includes("(maybe)")
          )
          .map(castSubtitles),
      },
    };
  },
});
