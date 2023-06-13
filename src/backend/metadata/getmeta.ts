import { FetchError } from "ofetch";

import { formatJWMeta, mediaTypeToJW } from "./justwatch";
import { Tmdb } from "./tmdb";
import {
  TTVMediaToMediaType,
  Trakt,
  formatTTVMeta,
  mediaTypeToTTV,
} from "./trakttv";
import {
  JWMediaResult,
  JWSeasonMetaResult,
  JW_API_BASE,
  MWMediaMeta,
  MWMediaType,
  TMDBMovieData,
  TMDBShowData,
  TTVSeasonMetaResult,
} from "./types";
import { makeUrl, proxiedFetch } from "../helpers/fetch";

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
  imdbId?: string;
  tmdbId?: string;
}

export async function getMetaFromId(
  type: MWMediaType,
  id: string,
  seasonId?: string
): Promise<DetailedMeta | null> {
  const result = await Trakt.searchById(id, mediaTypeToJW(type));
  if (!result) return null;
  const details = await Tmdb.getMediaDetails(id, type);

  if (!details) return null;

  let imdbId;
  if (type === MWMediaType.MOVIE) {
    imdbId = (details as TMDBMovieData).imdb_id ?? undefined;
  }

  let seasonData: TTVSeasonMetaResult | undefined;

  if (type === MWMediaType.SERIES) {
    const seasons = (details as TMDBShowData).seasons;
    const season =
      seasons?.find((v) => v.id.toString() === seasonId) ?? seasons?.[0];

    const episodes = await Trakt.getEpisodes(
      result.ttv_entity_id,
      season?.season_number ?? 1
    );

    if (season && episodes) {
      seasonData = {
        id: season.id.toString(),
        season_number: season.season_number,
        title: season.name,
        episodes,
      };
    }
  }

  const meta = formatTTVMeta(result, seasonData);
  if (!meta) return null;

  console.log(meta);

  return {
    meta,
    imdbId,
    tmdbId: id,
  };
}

export async function getLegacyMetaFromId(
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

export function MWMediaToId(media: MWMediaMeta): string {
  return ["MW", mediaTypeToTTV(media.type), media.id].join("-");
}

export function decodeMWId(
  paramId: string
): { id: string; type: MWMediaType } | null {
  const [prefix, type, id] = paramId.split("-", 3);
  if (prefix !== "MW") return null;
  let mediaType;
  try {
    mediaType = TTVMediaToMediaType(type);
  } catch {
    return null;
  }
  return {
    type: mediaType,
    id,
  };
}

export async function convertLegacyUrl(
  url: string
): Promise<string | undefined> {
  if (url.startsWith("/media/JW")) {
    const urlParts = url.split("/").slice(2);
    const [, type, id] = urlParts[0].split("-", 3);
    const meta = await getLegacyMetaFromId(TTVMediaToMediaType(type), id);
    if (!meta) return undefined;
    const tmdbId = meta.tmdbId;
    if (!tmdbId) return undefined;
    return `/media/MW-${type}-${tmdbId}`;
  }
  return undefined;
}
