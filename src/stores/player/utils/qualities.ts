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

const qualitySorting: Record<SourceQuality, number> = {
  "1080": 40,
  "360": 10,
  "480": 20,
  "720": 30,
  unknown: 0,
};
const sortedQualities: SourceQuality[] = Object.entries(qualitySorting)
  .sort((a, b) => b[1] - a[1])
  .map<SourceQuality>((v) => v[0] as SourceQuality);

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
    const bestQuality = sortedQualities.find(
      (v) => source.qualities[v] && (source.qualities[v]?.url.length ?? 0) > 0
    );
    if (bestQuality) {
      const stream = source.qualities[bestQuality];
      if (stream) {
        return { stream, quality: bestQuality };
      }
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

export const allQualities = Object.keys(qualityMap) as SourceQuality[];

export function qualityToString(quality: SourceQuality): string {
  return qualityMap[quality];
}
