export enum MWStreamType {
  MP4 = "mp4",
  HLS = "hls",
}

export enum MWStreamQuality {
  Q360P = "360p",
  Q720P = "720p",
  Q1080P = "1080p",
  QUNKNOWN = "unknown",
}

export type MWStream = {
  streamUrl: string;
  type: MWStreamType;
  quality: MWStreamQuality;
};
