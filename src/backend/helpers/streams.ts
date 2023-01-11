export enum MWStreamType {
  MP4 = "mp4",
  HLS = "hls",
}

export type MWStream = {
  streamUrl: string;
  type: MWStreamType;
};
