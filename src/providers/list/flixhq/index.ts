import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWProviderMediaResult,
} from "@/providers/types";

import { conf } from "@/setup/config";

export const flixhqProvider: MWMediaProvider = {
  id: "flixhq",
  enabled: true,
  type: [MWMediaType.MOVIE],
  displayName: "flixhq",

  async getMediaFromPortable(
    media: MWPortableMedia
  ): Promise<MWProviderMediaResult> {
    const searchRes = await fetch(
      `${
        conf().CORS_PROXY_URL
      }https://api.consumet.org/movies/flixhq/info?id=${encodeURIComponent(
        media.mediaId
      )}`
    ).then((d) => d.json());

    return {
      ...media,
      title: searchRes.title,
      year: searchRes.releaseDate,
    } as MWProviderMediaResult;
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const searchRes = await fetch(
      `${
        conf().CORS_PROXY_URL
      }https://api.consumet.org/movies/flixhq/${encodeURIComponent(
        query.searchQuery
      )}`
    ).then((d) => d.json());

    const results: MWProviderMediaResult[] = (searchRes || []).results.map(
      (item: any) => ({
        title: item.title,
        year: item.releaseDate,
        mediaId: item.id,
        type: MWMediaType.MOVIE,
      })
    );

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    const searchRes = await fetch(
      `${
        conf().CORS_PROXY_URL
      }https://api.consumet.org/movies/flixhq/info?id=${encodeURIComponent(
        media.mediaId
      )}`
    ).then((d) => d.json());

    const params = new URLSearchParams({
      episodeId: searchRes.episodes[0].id,
      mediaId: media.mediaId,
    });

    const watchRes = await fetch(
      `${
        conf().CORS_PROXY_URL
      }https://api.consumet.org/movies/flixhq/watch?${encodeURIComponent(
        params.toString()
      )}`
    ).then((d) => d.json());

    const source = watchRes.sources.reduce((p: any, c: any) =>
      c.quality > p.quality ? c : p
    );

    return {
      url: source.url,
      type: source.isM3U8 ? "m3u8" : "mp4",
      captions: [],
    } as MWMediaStream;
  },
};
