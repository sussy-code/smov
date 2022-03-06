import contentCache from "./methods/contentCache";
import {
  MWMedia,
  MWMediaProvider,
  MWMediaStream,
  MWPortableMedia,
  MWQuery,
} from "./types";

export interface MWWrappedMediaProvider extends MWMediaProvider {
  getMediaFromPortable(media: MWPortableMedia): Promise<MWMedia>;
  searchForMedia(query: MWQuery): Promise<MWMedia[]>;
  getStream(media: MWPortableMedia): Promise<MWMediaStream>;
}

export function WrapProvider(
  provider: MWMediaProvider
): MWWrappedMediaProvider {
  return {
    ...provider,

    async getMediaFromPortable(media: MWPortableMedia): Promise<MWMedia> {
      // consult cache first
      const output = contentCache.get(media);
      if (output) {
        output.season = media.season;
        output.episode = media.episode;
        return output;
      }

      const mediaObject = {
        ...(await provider.getMediaFromPortable(media)),
        providerId: provider.id,
        mediaType: media.mediaType,
      };
      contentCache.set(media, mediaObject, 60 * 60);
      return mediaObject;
    },

    async searchForMedia(query: MWQuery): Promise<MWMedia[]> {
      return (await provider.searchForMedia(query)).map<MWMedia>((m) => ({
        ...m,
        providerId: provider.id,
        mediaType: query.type,
      }));
    },
  };
}
