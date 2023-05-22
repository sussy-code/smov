export enum MWStreamType {
  MP4 = "mp4",
  HLS = "hls",
}

// subsrt-ts supported types
export enum MWCaptionType {
  VTT = "vtt",
  SRT = "srt",
  LRC = "lrc",
  SBV = "sbv",
  SUB = "sub",
  SSA = "ssa",
  ASS = "ass",
  JSON = "json",
  UNKNOWN = "unknown",
}

export enum MWStreamQuality {
  Q360P = "360p",
  Q540P = "540p",
  Q480P = "480p",
  Q720P = "720p",
  Q1080P = "1080p",
  QUNKNOWN = "unknown",
}

export type MWCaption = {
  needsProxy?: boolean;
  url: string;
  type: MWCaptionType;
  langIso: string;
};

export type MWStream = {
  streamUrl: string;
  type: MWStreamType;
  quality: MWStreamQuality;
  providerId?: string;
  embedId?: string;
  captions: MWCaption[];
};

export type MWEmbedStream = MWStream & {
  embedId: string;
};
