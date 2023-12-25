const mediaErrorMap: Record<number, { name: string; key: string }> = {
  1: {
    name: "MEDIA_ERR_ABORTED",
    key: "player.playbackError.errors.errorAborted",
  },
  2: {
    name: "MEDIA_ERR_NETWORK",
    key: "player.playbackError.errors.errorNetwork",
  },
  3: {
    name: "MEDIA_ERR_DECODE",
    key: "player.playbackError.errors.errorDecode",
  },
  4: {
    name: "MEDIA_ERR_SRC_NOT_SUPPORTED",
    key: "player.playbackError.errors.errorNotSupported",
  },
};

export function getMediaErrorDetails(
  err: MediaError | null,
): (typeof mediaErrorMap)[number] {
  const item = mediaErrorMap[err?.code ?? -1];
  if (!item) {
    return {
      name: "MEDIA_ERR_GENERIC",
      key: "player.playbackError.errors.errorGenericMedia",
    };
  }
  return item;
}
