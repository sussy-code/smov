import { MWMedia, MWMediaProvider, MWMediaType, MWPortableMedia, MWQuery } from "@/scrapers/types";

export const theFlixSeriesScraper: MWMediaProvider = {
  id: "theflixseries",
  enabled: true,
  type: MWMediaType.SERIES,
  displayName: "TheFlix",

  async getMediaFromPortable(media: MWPortableMedia): Promise<MWMedia> {
    return {
      ...media,
      title: "title here"
    }
  },

  async searchForMedia(query: MWQuery): Promise<MWMedia[]> {
    return [{
      mediaId: "b",
      providerId: this.id,
      title: `series test`,
    }];
  },
}
