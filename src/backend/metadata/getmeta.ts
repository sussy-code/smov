import { formatJWMeta, JWMediaResult } from "./justwatch";
import { MWMediaMeta, MWMediaType } from "./types";

const JW_API_BASE = "https://apis.justwatch.com";

// http://localhost:5173/#/media/movie-439596/

type JWExternalIdType =
  | "eidr"
  | "imdb_latest"
  | "imdb"
  | "tmdb_latest"
  | "tmdb"
  | "tms";

interface JWExternalId {
  provider: JWExternalIdType;
  external_id: string;
}

interface JWDetailedMeta extends JWMediaResult {
  external_ids: JWExternalId[];
}

export interface DetailedMeta {
  meta: MWMediaMeta;
  tmdbId: string;
  imdbId: string;
}

export async function getMetaFromId(
  type: MWMediaType,
  id: string
): Promise<DetailedMeta> {
  let queryType = "";
  if (type === MWMediaType.MOVIE) queryType = "movie";
  else if (type === MWMediaType.SERIES) queryType = "show";
  else if (type === MWMediaType.ANIME)
    throw new Error("Anime search type is not supported");

  const data = await fetch(
    `${JW_API_BASE}/content/titles/${queryType}/${encodeURIComponent(
      id
    )}/locale/en_US`
  ).then((res) => res.json() as Promise<JWDetailedMeta>);

  const imdbId = data.external_ids.find(
    (v) => v.provider === "imdb_latest"
  )?.external_id;
  const tmdbId = data.external_ids.find(
    (v) => v.provider === "tmdb_latest"
  )?.external_id;

  if (!imdbId || !tmdbId) throw new Error("not enough info");

  return {
    meta: formatJWMeta(data),
    imdbId,
    tmdbId,
  };
}
