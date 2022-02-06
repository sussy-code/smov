import { MWMedia, MWMediaProvider, MWMediaType, MWPortableMedia, MWQuery } from "@/scrapers/types";

export const theFlixScraper: MWMediaProvider = {
  id: "theflix",
  enabled: true,
  type: MWMediaType.MOVIE,
  displayName: "TheFlix",

  async getMediaFromPortable(media: MWPortableMedia): Promise<MWMedia> {
    return {
      ...media,
      title: "title here"
    }
  },

  async searchForMedia(query: MWQuery): Promise<MWMedia[]> {
    return [{
      mediaId: "a",
      providerId: this.id,
      title: "testing",
    }];
  },
}
