import { FetchError } from "ofetch";
import { makeUrl, mwFetch } from "../helpers/fetch";
import {
  formatJWMeta,
  JWMediaResult,
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
  id: string
): Promise<DetailedMeta | null> {
  const queryType = mediaTypeToJW(type);

  let data: JWDetailedMeta;
  try {
    const url = makeUrl("/content/titles/{type}/{id}/locale/en_US", {
      type: queryType,
      id,
    });
    data = await mwFetch<JWDetailedMeta>(url, { baseURL: JW_API_BASE });
  } catch (err) {
    if (err instanceof FetchError) {
      // 400 and 404 are treated as not found
      if (err.statusCode === 400 || err.statusCode === 404) return null;
    }
    throw err;
  }

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
