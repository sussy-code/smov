import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWQuery,
} from "scrapers/types";

import {
  searchTheFlix,
  getDataFromSearch,
  turnDataIntoMedia,
} from "scrapers/list/theflix/search";

import { getDataFromPortableSearch } from "scrapers/list/theflix/portableToMedia";
import { MWProviderMediaResult } from "scrapers";

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
};
