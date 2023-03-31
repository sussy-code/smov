import { compareTitle } from "@/utils/titleMatch";
import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "../helpers/streams";
import { MWMediaType } from "../metadata/types";

const flixHqBase = "https://api.consumet.org/meta/tmdb";

type FlixHQMediaType = "Movie" | "TV Series";
interface FLIXMediaBase {
  id: number;
  title: string;
  url: string;
  image: string;
  type: FlixHQMediaType;
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

function flixTypeToMWType(type: FlixHQMediaType) {
  if (type === "Movie") return MWMediaType.MOVIE;
  return MWMediaType.SERIES;
}

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
      if (v.type !== "Movie" && v.type !== "TV Series") return false;
      return (
        compareTitle(v.title, media.meta.title) &&
        flixTypeToMWType(v.type) === media.meta.type &&
        v.releaseDate === media.meta.year
      );
    });

    if (!foundItem) throw new Error("No watchable item found");

    // get media info
    progress(25);
    const mediaInfo = await proxiedFetch<any>(`/info/${foundItem.id}`, {
      baseURL: flixHqBase,
      params: {
        type: flixTypeToMWType(foundItem.type),
      },
    });
    if (!mediaInfo.id) throw new Error("No watchable item found");
    // get stream info from media
    progress(50);

    let episodeId: string | undefined;
    if (media.meta.type === MWMediaType.MOVIE) {
      episodeId = mediaInfo.episodeId;
    } else if (media.meta.type === MWMediaType.SERIES) {
      const seasonNo = media.meta.seasonData.number;
      const episodeNo = media.meta.seasonData.episodes.find(
        (e) => e.id === episode
      )?.number;

      const season = mediaInfo.seasons.find((o: any) => o.season === seasonNo);
      episodeId = season.episodes.find((o: any) => o.episode === episodeNo).id;
    }
    if (!episodeId) throw new Error("No watchable item found");
    progress(75);
    const watchInfo = await proxiedFetch<any>(`/watch/${episodeId}`, {
      baseURL: flixHqBase,
      params: {
        id: mediaInfo.id,
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
