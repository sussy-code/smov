import { proxiedFetch } from "@/backend/helpers/fetch";
import { registerProvider } from "@/backend/helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "@/backend/helpers/streams";
import { MWMediaType } from "@/backend/metadata/types/mw";

const streamflixBase = "https://us-west2-compute-proxied.streamflix.one";

const qualityMap: Record<number, MWStreamQuality> = {
  360: MWStreamQuality.Q360P,
  540: MWStreamQuality.Q540P,
  480: MWStreamQuality.Q480P,
  720: MWStreamQuality.Q720P,
  1080: MWStreamQuality.Q1080P,
};

registerProvider({
  id: "streamflix",
  displayName: "StreamFlix",
  disabled: false,
  rank: 69,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, episode, progress }) {
    if (!this.type.includes(media.meta.type)) {
      throw new Error("Unsupported type");
    }

    progress(30);
    const type = media.meta.type === MWMediaType.MOVIE ? "movies" : "tv";
    let seasonNumber: number | undefined;
    let episodeNumber: number | undefined;

    if (media.meta.type === MWMediaType.SERIES) {
      // can't do type === "tv" here :(
      seasonNumber = media.meta.seasonData.number;
      episodeNumber = media.meta.seasonData.episodes.find(
        (e: any) => e.id === episode
      )?.number;
    }

    const streamRes = await proxiedFetch<any>(`/api/player/${type}`, {
      baseURL: streamflixBase,
      params: {
        id: media.tmdbId,
        s: seasonNumber,
        e: episodeNumber,
      },
    });
    if (!streamRes.headers.Referer) throw new Error("No watchable item found");
    progress(90);
    return {
      embeds: [],
      stream: {
        streamUrl: streamRes.sources[0].url,
        quality: qualityMap[streamRes.sources[0].quality],
        type: MWStreamType.HLS,
        captions: streamRes.subtitles.map((s: Record<string, any>) => ({
          needsProxy: true,
          url: s.url,
          type: MWCaptionType.VTT,
          langIso: s.lang,
        })),
      },
    };
  },
});
