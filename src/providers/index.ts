import { getProviderFromId } from "./methods/helpers";
import {
  MWMedia,
  MWPortableMedia,
  MWMediaStream,
} from "./types";
import contentCache from "./methods/contentCache";
export * from "./types";
export * from "./methods/helpers";
export * from "./methods/providers";
export * from "./methods/search";

/*
 ** Turn media object into a portable media object
 */
export function convertMediaToPortable(media: MWMedia): MWPortableMedia {
  return {
    mediaId: media.mediaId,
    providerId: media.providerId,
    mediaType: media.mediaType,
    episode: media.episode,
    season: media.season,
  };
}

/*
 ** Turn portable media into media object
 */
export async function convertPortableToMedia(
  portable: MWPortableMedia
): Promise<MWMedia | undefined> {
  // consult cache first
  let output = contentCache.get(portable);
  if (output) return output;

  const provider = getProviderFromId(portable.providerId);
  return await provider?.getMediaFromPortable(portable);
}

/*
 ** find provider from portable and get stream from that provider
 */
export async function getStream(
  media: MWPortableMedia
): Promise<MWMediaStream | undefined> {
  const provider = getProviderFromId(media.providerId);
  if (!provider) return undefined;

  return await provider.getStream(media);
}
