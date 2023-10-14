export type SourceQuality = "unknown" | "360" | "480" | "720" | "1080";

export type StreamType = "hls" | "mp4";

export type SourceFileStream = {
  type: "mp4";
  url: string;
};

export type LoadableSource = {
  type: StreamType;
  url: string;
};

export type SourceSliceSource =
  | {
      type: "file";
      qualities: Partial<Record<SourceQuality, SourceFileStream>>;
    }
  | {
      type: "hls";
      url: string;
    };

export function selectQuality(source: SourceSliceSource): {
  stream: LoadableSource;
  quality: null | SourceQuality;
} {
  if (source.type === "hls")
    return {
      stream: source,
      quality: null,
    };
  if (source.type === "file") {
    const firstQuality = Object.keys(
      source.qualities
    )[0] as keyof typeof source.qualities;
    const stream = source.qualities[firstQuality];
    if (stream) {
      return { stream, quality: firstQuality };
    }
  }
  throw new Error("couldn't select quality");
}

const qualityMap: Record<SourceQuality, string> = {
  "1080": "1080p",
  "360": "360p",
  "480": "480p",
  "720": "720p",
  unknown: "unknown",
};

export const allQualities = Object.keys(qualityMap);

export function qualityToString(quality: SourceQuality): string {
  return qualityMap[quality];
}
