import { MWMediaType } from "./types";

export const JW_API_BASE = "https://apis.justwatch.com";

export type JWContentTypes = "movie" | "show";

export type JWMediaResult = {
  title: string;
  poster?: string;
  id: number;
  original_release_year: number;
  jw_entity_id: string;
  object_type: JWContentTypes;
};

export function mediaTypeToJW(type: MWMediaType): JWContentTypes {
  if (type === MWMediaType.MOVIE) return "movie";
  if (type === MWMediaType.SERIES) return "show";
  throw new Error("unsupported type");
}

export function JWMediaToMediaType(type: string): MWMediaType {
  if (type === "movie") return MWMediaType.MOVIE;
  if (type === "show") return MWMediaType.SERIES;
  throw new Error("unsupported type");
}

export function formatJWMeta(media: JWMediaResult) {
  const type = JWMediaToMediaType(media.object_type);
  return {
    title: media.title,
    id: media.id.toString(),
    year: media.original_release_year.toString(),
    poster: media.poster
      ? `https://images.justwatch.com${media.poster.replace(
          "{profile}",
          "s166"
        )}`
      : undefined,
    type,
  };
}
