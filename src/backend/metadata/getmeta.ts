import { FetchError } from "ofetch";
import { makeUrl, proxiedFetch } from "../helpers/fetch";
import {
  formatJWMeta,
  JWMediaResult,
  JWSeasonMetaResult,
  JW_API_BASE,
  mediaTypeToJW,
} from "./justwatch";
import { MWMediaMeta, MWMediaType } from "./types";

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
  id: string,
  seasonId?: string
): Promise<DetailedMeta | null> {
  const queryType = mediaTypeToJW(type);

  let data: JWDetailedMeta;
  try {
    const url = makeUrl("/content/titles/{type}/{id}/locale/en_US", {
      type: queryType,
      id,
    });
    data = await proxiedFetch<JWDetailedMeta>(url, { baseURL: JW_API_BASE });
  } catch (err) {
    if (err instanceof FetchError) {
      // 400 and 404 are treated as not found
      if (err.statusCode === 400 || err.statusCode === 404) return null;
    }
    throw err;
  }

  let imdbId = data.external_ids.find(
    (v) => v.provider === "imdb_latest"
  )?.external_id;
  if (!imdbId)
    imdbId = data.external_ids.find((v) => v.provider === "imdb")?.external_id;

  let tmdbId = data.external_ids.find(
    (v) => v.provider === "tmdb_latest"
  )?.external_id;
  if (!tmdbId)
    tmdbId = data.external_ids.find((v) => v.provider === "tmdb")?.external_id;

  if (!imdbId || !tmdbId) throw new Error("not enough info");

  let seasonData: JWSeasonMetaResult | undefined;
  if (data.object_type === "show") {
    const seasonToScrape = seasonId ?? data.seasons?.[0].id.toString() ?? "";
    const url = makeUrl("/content/titles/show_season/{id}/locale/en_US", {
      id: seasonToScrape,
    });
    seasonData = await proxiedFetch<any>(url, { baseURL: JW_API_BASE });
  }

  return {
    meta: formatJWMeta(data, seasonData),
    imdbId,
    tmdbId,
  };
}
