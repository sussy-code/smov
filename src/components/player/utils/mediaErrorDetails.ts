const mediaErrorMap: Record<number, { name: string; message: string }> = {
  1: {
    name: "MEDIA_ERR_ABORTED",
    message:
      "The fetching of the associated resource was aborted by the user's request.",
  },
  2: {
    name: "MEDIA_ERR_NETWORK",
    message:
      "Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available.",
  },
  3: {
    name: "MEDIA_ERR_DECODE",
    message:
      "Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error.",
  },
  4: {
    name: "MEDIA_ERR_SRC_NOT_SUPPORTED",
    message:
      "The associated resource or media provider object has been found to be unsuitable.",
  },
};

export function getMediaErrorDetails(err: MediaError | null): {
  name: string;
  message: string;
} {
  const item = mediaErrorMap[err?.code ?? -1];
  if (!item) {
    return {
      name: "MediaError",
      message: "Unknown media error occured",
    };
  }
  return item;
}
