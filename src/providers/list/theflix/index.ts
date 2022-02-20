import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
} from "providers/types";

import {
  searchTheFlix,
  getDataFromSearch,
  turnDataIntoMedia,
} from "providers/list/theflix/search";

import { getDataFromPortableSearch } from "providers/list/theflix/portableToMedia";
import { MWProviderMediaResult } from "providers";
import { CORS_PROXY_URL } from "mw_constants";

export const theFlixScraper: MWMediaProvider = {
  id: "theflix",
  enabled: true,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  displayName: "theflix",

  async getMediaFromPortable(
    media: MWPortableMedia
  ): Promise<MWProviderMediaResult> {
    const data: any = await getDataFromPortableSearch(media);

    return {
      ...media,
      year: new Date(data.releaseDate).getFullYear().toString(),
      title: data.name,
    };
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const searchRes = await searchTheFlix(query);
    const searchData = await getDataFromSearch(searchRes, 10);

    const results: MWProviderMediaResult[] = [];
    for (let item of searchData) {
      results.push(turnDataIntoMedia(item));
    }

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    let url = "";

    if (media.mediaType === MWMediaType.MOVIE) {
      url = `${CORS_PROXY_URL}https://theflix.to/movie/${media.mediaId}?movieInfo=${media.mediaId}`;
    } else if (media.mediaType === MWMediaType.SERIES) {
      url = `${CORS_PROXY_URL}https://theflix.to/tv-show/${media.mediaId}/season-${media.season}/episode-${media.episode}`;
    }

    const res = await fetch(url).then((d) => d.text());

    const prop: HTMLElement | undefined = Array.from(
      new DOMParser()
        .parseFromString(res, "text/html")
        .querySelectorAll("script")
    ).find((e) => e.textContent?.includes("theflixvd.b-cdn"));

    if (!prop || !prop.textContent) {
      throw new Error("Could not find stream");
    }

    const data = JSON.parse(prop.textContent);
    return { url: data.props.pageProps.videoUrl, type: "mp4" };
  },
};
