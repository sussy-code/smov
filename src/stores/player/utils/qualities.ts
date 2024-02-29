import { Qualities, Stream } from "@movie-web/providers";

import { QualityStore } from "@/stores/quality";

export type SourceQuality = Qualities;

export type StreamType = "hls" | "mp4";

export type SourceFileStream = {
  type: "mp4";
  url: string;
};

export type LoadableSource = {
  type: StreamType;
  url: string;
  headers?: Stream["headers"];
  preferredHeaders?: Stream["preferredHeaders"];
};

export type SourceSliceSource =
  | {
      type: "file";
      qualities: Partial<Record<SourceQuality, SourceFileStream>>;
      headers?: Stream["headers"];
      preferredHeaders?: Stream["preferredHeaders"];
    }
  | {
      type: "hls";
      url: string;
      headers?: Stream["headers"];
      preferredHeaders?: Stream["preferredHeaders"];
    };

const qualitySorting: Record<SourceQuality, number> = {
  unknown: 0,
  "360": 10,
  "480": 20,
  "720": 30,
  "1080": 40,
  "4k": 25, // 4k has lower priority, you need faster internet for it
};
const sortedQualities: SourceQuality[] = Object.entries(qualitySorting)
  .sort((a, b) => b[1] - a[1])
  .map<SourceQuality>((v) => v[0] as SourceQuality);

export function getPreferredQuality(
  availableQualites: SourceQuality[],
  qualityPreferences: QualityStore["quality"],
) {
  if (
    qualityPreferences.automaticQuality ||
    qualityPreferences.lastChosenQuality === null ||
    qualityPreferences.lastChosenQuality === "unknown"
  )
    return sortedQualities.find((v) => availableQualites.includes(v));

  // get preferred quality - not automatic or unknown
  const chosenQualityIndex = sortedQualities.indexOf(
    qualityPreferences.lastChosenQuality,
  );
  let nearestChoseQuality: undefined | SourceQuality;

  // check chosen quality or lower
  for (let i = chosenQualityIndex; i < sortedQualities.length; i += 1) {
    if (availableQualites.includes(sortedQualities[i])) {
      nearestChoseQuality = sortedQualities[i];
      break;
    }
  }
  if (nearestChoseQuality) return nearestChoseQuality;

  // chosen quality or lower doesn't exist, try higher
  for (let i = chosenQualityIndex; i >= 0; i -= 1) {
    if (availableQualites.includes(sortedQualities[i])) {
      nearestChoseQuality = sortedQualities[i];
      break;
    }
  }
  return nearestChoseQuality;
}

export function selectQuality(
  source: SourceSliceSource,
  qualityPreferences: QualityStore["quality"],
): {
  stream: LoadableSource;
  quality: null | SourceQuality;
} {
  if (source.type === "hls")
    return {
      stream: source,
      quality: null,
    };
  if (source.type === "file") {
    const availableQualities = Object.entries(source.qualities)
      .filter((entry) => (entry[1].url.length ?? 0) > 0)
      .map((entry) => entry[0]) as SourceQuality[];
    const quality = getPreferredQuality(availableQualities, qualityPreferences);
    if (quality) {
      const stream = source.qualities[quality];
      if (stream) {
        return { stream, quality };
      }
    }
  }
  throw new Error("couldn't select quality");
}

const qualityNameMap: Record<SourceQuality, string> = {
  "4k": "4K",
  "1080": "1080p",
  "360": "360p",
  "480": "480p",
  "720": "720p",
  unknown: "unknown",
};

export const allQualities = Object.keys(qualityNameMap) as SourceQuality[];

export function qualityToString(quality: SourceQuality): string {
  return qualityNameMap[quality];
}
