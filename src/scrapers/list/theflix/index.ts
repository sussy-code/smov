import { MWMedia, MWMediaProvider, MWMediaType, MWPortableMedia, MWQuery } from "../../scrapers";

export const theFlixScraper: MWMediaProvider = {
  id: "theflix",
  type: MWMediaType.MOVIE,
  getMediaFromPortable(media: MWPortableMedia): MWMedia {
    return {
      ...media,
      title: "title here"
    }
  },
  searchForMedia(query: MWQuery): MWMedia[] {
    return [];
  },
}
