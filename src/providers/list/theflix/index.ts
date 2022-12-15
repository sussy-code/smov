import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWMediaSeasons,
  MWProviderMediaResult,
} from "@/providers/types";

import {
  searchTheFlix,
  getDataFromSearch,
  turnDataIntoMedia,
} from "@/providers/list/theflix/search";

import { getDataFromPortableSearch } from "@/providers/list/theflix/portableToMedia";
import { CORS_PROXY_URL } from "@/mw_constants";

export const theFlixScraper: MWMediaProvider = {
  id: "theflix",
  enabled: false,
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
    for (const item of searchData) {
      results.push(turnDataIntoMedia(item));
    }

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    let url = "";

    if (media.mediaType === MWMediaType.MOVIE) {
      url = `${CORS_PROXY_URL}https://theflix.to/movie/${media.mediaId}?movieInfo=${media.mediaId}`;
    } else if (media.mediaType === MWMediaType.SERIES) {
      url = `${CORS_PROXY_URL}https://theflix.to/tv-show/${media.mediaId}/season-${media.seasonId}/episode-${media.episodeId}`;
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

    return { url: data.props.pageProps.videoUrl, type: "mp4", captions: [] };
  },

  async getSeasonDataFromMedia(
    media: MWPortableMedia
  ): Promise<MWMediaSeasons> {
    const url = `${CORS_PROXY_URL}https://theflix.to/tv-show/${media.mediaId}/season-${media.seasonId}/episode-${media.episodeId}`;
    const res = await fetch(url).then((d) => d.text());

    const node: Element = Array.from(
      new DOMParser()
        .parseFromString(res, "text/html")
        .querySelectorAll(`script[id="__NEXT_DATA__"]`)
    )[0];

    let data = JSON.parse(node.innerHTML).props.pageProps.selectedTv.seasons;

    data = data.filter((season: any) => season.releaseDate != null);
    data = data.map((season: any) => {
      const episodes = season.episodes.filter(
        (episode: any) => episode.releaseDate != null
      );
      return { ...season, episodes };
    });

    return {
      seasons: data.map((d: any) => ({
        sort: d.seasonNumber === 0 ? 999 : d.seasonNumber,
        id: d.seasonNumber.toString(),
        type: d.seasonNumber === 0 ? "special" : "season",
        title: d.name,
        episodes: d.episodes.map((e: any) => ({
          title: e.name,
          sort: e.episodeNumber,
          id: e.episodeNumber.toString(),
          episodeNumber: e.episodeNumber,
        })),
      })),
    };
  },
};
