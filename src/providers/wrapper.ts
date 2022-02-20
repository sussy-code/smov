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
      return {
        ...(await provider.getMediaFromPortable(media)),
        providerId: provider.id,
        mediaType: media.mediaType,
      };
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
