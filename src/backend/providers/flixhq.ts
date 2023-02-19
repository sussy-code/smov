import { compareTitle } from "@/utils/titleMatch";
import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";
import { MWMediaType } from "../metadata/types";

const flixHqBase = "https://api.consumet.org/movies/flixhq";

registerProvider({
  id: "flixhq",
  displayName: "FlixHQ",
  rank: 100,
  type: [MWMediaType.MOVIE],

  async scrape({ media, progress }) {
    // search for relevant item
    const searchResults = await proxiedFetch<any>(
      `/${encodeURIComponent(media.meta.title)}`,
      {
        baseURL: flixHqBase,
      }
    );
    const foundItem = searchResults.results.find((v: any) => {
      return (
        compareTitle(v.title, media.meta.title) &&
        v.releaseDate === media.meta.year
      );
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

    // get stream info from media
    progress(75);
    const watchInfo = await proxiedFetch<any>("/watch", {
      baseURL: flixHqBase,
      params: {
        episodeId: mediaInfo.episodes[0].id,
        mediaId: flixId,
      },
    });

    // get best quality source
    const source = watchInfo.sources.reduce((p: any, c: any) =>
      c.quality > p.quality ? c : p
    );

    return {
      embeds: [],
      stream: {
        streamUrl: source.url,
        quality: MWStreamQuality.QUNKNOWN,
        type: source.isM3U8 ? MWStreamType.HLS : MWStreamType.MP4,
        captions: [],
      },
    };
  },
});
