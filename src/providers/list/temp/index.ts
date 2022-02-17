import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWQuery,
} from "providers/types";

import { MWProviderMediaResult } from "providers";

export const tempScraper: MWMediaProvider = {
  id: "temp",
  enabled: true,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  displayName: "temp",

  async getMediaFromPortable(
    media: MWPortableMedia
  ): Promise<MWProviderMediaResult> {
    return {
      ...media,
      year: "1234",
      title: "temp",
    };
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {

    return [];
  },
};
