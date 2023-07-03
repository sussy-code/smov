import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "../helpers/streams";
import { MWMediaType } from "../metadata/types/mw";

const netfilmBase = "https://net-film.vercel.app";

const qualityMap: Record<number, MWStreamQuality> = {
  360: MWStreamQuality.Q360P,
  540: MWStreamQuality.Q540P,
  480: MWStreamQuality.Q480P,
  720: MWStreamQuality.Q720P,
  1080: MWStreamQuality.Q1080P,
};

registerProvider({
  id: "netfilm",
  displayName: "NetFilm",
  rank: 15,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  disabled: true, // The creator has asked us (very nicely) to leave him alone. Until (if) we self-host, netfilm should remain disabled

  async scrape({ media, episode, progress }) {
    if (!this.type.includes(media.meta.type)) {
      throw new Error("Unsupported type");
    }
    // search for relevant item
    const searchResponse = await proxiedFetch<any>(
      `/api/search?keyword=${encodeURIComponent(media.meta.title)}`,
      {
        baseURL: netfilmBase,
      }
    );

    const searchResults = searchResponse.data.results;
    progress(25);

    if (media.meta.type === MWMediaType.MOVIE) {
      const foundItem = searchResults.find((v: any) => {
        return v.name === media.meta.title && v.releaseTime === media.meta.year;
      });
      if (!foundItem) throw new Error("No watchable item found");
      const netfilmId = foundItem.id;

      // get stream info from media
      progress(75);
      const watchInfo = await proxiedFetch<any>(
        `/api/episode?id=${netfilmId}`,
        {
          baseURL: netfilmBase,
        }
      );

      const data = watchInfo.data;

      // get best quality source
      const source: { url: string; quality: number } = data.qualities.reduce(
        (p: any, c: any) => (c.quality > p.quality ? c : p)
      );

      const mappedCaptions = data.subtitles.map((sub: Record<string, any>) => ({
        needsProxy: false,
        url: sub.url.replace("https://convert-srt-to-vtt.vercel.app/?url=", ""),
        type: MWCaptionType.SRT,
        langIso: sub.language,
      }));

      return {
        embeds: [],
        stream: {
          streamUrl: source.url
            .replace("akm-cdn", "aws-cdn")
            .replace("gg-cdn", "aws-cdn"),
          quality: qualityMap[source.quality],
          type: MWStreamType.HLS,
          captions: mappedCaptions,
        },
      };
    }

    if (media.meta.type !== MWMediaType.SERIES)
      throw new Error("Unsupported type");

    const desiredSeason = media.meta.seasonData.number;

    const searchItems = searchResults
      .filter((v: any) => {
        return v.name.includes(media.meta.title);
      })
      .map((v: any) => {
        return {
          ...v,
          season: parseInt(v.name.split(" ").at(-1), 10) || 1,
        };
      });

    const foundItem = searchItems.find((v: any) => {
      return v.season === desiredSeason;
    });

    progress(50);
    const seasonDetail = await proxiedFetch<any>(
      `/api/detail?id=${foundItem.id}&category=${foundItem.categoryTag[0].id}`,
      {
        baseURL: netfilmBase,
      }
    );

    const episodeNo = media.meta.seasonData.episodes.find(
      (v: any) => v.id === episode
    )?.number;
    const episodeData = seasonDetail.data.episodeVo.find(
      (v: any) => v.seriesNo === episodeNo
    );

    progress(75);
    const episodeStream = await proxiedFetch<any>(
      `/api/episode?id=${foundItem.id}&category=1&episode=${episodeData.id}`,
      {
        baseURL: netfilmBase,
      }
    );

    const data = episodeStream.data;

    // get best quality source
    const source: { url: string; quality: number } = data.qualities.reduce(
      (p: any, c: any) => (c.quality > p.quality ? c : p)
    );

    const mappedCaptions = data.subtitles.map((sub: Record<string, any>) => ({
      needsProxy: false,
      url: sub.url.replace("https://convert-srt-to-vtt.vercel.app/?url=", ""),
      type: MWCaptionType.SRT,
      langIso: sub.language,
    }));

    return {
      embeds: [],
      stream: {
        streamUrl: source.url
          .replace("akm-cdn", "aws-cdn")
          .replace("gg-cdn", "aws-cdn"),
        quality: qualityMap[source.quality],
        type: MWStreamType.HLS,
        captions: mappedCaptions,
      },
    };
  },
});
