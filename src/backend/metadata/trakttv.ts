import { conf } from "@/setup/config";

import { Tmdb } from "./tmdb";
import {
  DetailedMeta,
  MWMediaMeta,
  MWMediaType,
  MWSeasonMeta,
  TMDBShowData,
  TTVContentTypes,
  TTVMediaResult,
  TTVSearchResult,
  TTVSeasonMetaResult,
} from "./types";
import { mwFetch } from "../helpers/fetch";

export function mediaTypeToTTV(type: MWMediaType): TTVContentTypes {
  if (type === MWMediaType.MOVIE) return "movie";
  if (type === MWMediaType.SERIES) return "show";
  throw new Error("unsupported type");
}

export function TTVMediaToMediaType(type: string): MWMediaType {
  if (type === "movie") return MWMediaType.MOVIE;
  if (type === "show") return MWMediaType.SERIES;
  throw new Error("unsupported type");
}

export function formatTTVMeta(
  media: TTVMediaResult,
  season?: TTVSeasonMetaResult
): MWMediaMeta {
  const type = TTVMediaToMediaType(media.object_type);
  let seasons: undefined | MWSeasonMeta[];
  if (type === MWMediaType.SERIES) {
    seasons = media.seasons
      ?.sort((a, b) => a.season_number - b.season_number)
      .map(
        (v): MWSeasonMeta => ({
          title: v.title,
          id: v.id.toString(),
          number: v.season_number,
        })
      );
  }

  return {
    title: media.title,
    id: media.id.toString(),
    year: media.original_release_year?.toString(),
    poster: media.poster,
    type,
    seasons: seasons as any,
    seasonData: season
      ? ({
          id: season.id.toString(),
          number: season.season_number,
          title: season.title,
          episodes: season.episodes
            .sort((a, b) => a.episode_number - b.episode_number)
            .map((v) => ({
              id: v.id.toString(),
              number: v.episode_number,
              title: v.title,
            })),
        } as any)
      : (undefined as any),
  };
}

export function TTVMediaToId(media: MWMediaMeta): string {
  return ["TTV", mediaTypeToTTV(media.type), media.id].join("-");
}

export function decodeTTVId(
  paramId: string
): { id: string; type: MWMediaType } | null {
  const [prefix, type, id] = paramId.split("-", 3);
  if (prefix !== "TTV") return null;
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

export async function formatTTVSearchResult(
  result: TTVSearchResult
): Promise<TTVMediaResult> {
  const type = TTVMediaToMediaType(result.type);
  const media = result[result.type];

  if (!media) throw new Error("invalid result");

  const details = await Tmdb.getMediaDetails(
    media.ids.tmdb.toString(),
    TTVMediaToMediaType(result.type)
  );
  console.log(details);

  const seasons =
    type === MWMediaType.SERIES
      ? (details as TMDBShowData).seasons?.map((v) => ({
          id: v.id,
          title: v.name,
          season_number: v.season_number,
        }))
      : undefined;

  return {
    title: media.title,
    poster: Tmdb.getMediaPoster(details.poster_path),
    id: media.ids.trakt,
    original_release_year: media.year,
    ttv_entity_id: media.ids.slug,
    object_type: mediaTypeToTTV(type),
    seasons,
  };
}

export abstract class Trakt {
  private static baseURL = "https://api.trakt.tv";

  private static headers = {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": conf().TRAKT_CLIENT_ID,
  };

  private static async get<T>(url: string): Promise<T> {
    const res = await mwFetch<any>(url, {
      headers: Trakt.headers,
      baseURL: Trakt.baseURL,
    });
    return res;
  }

  public static async search(
    query: string,
    type: "movie" | "show"
  ): Promise<MWMediaMeta[]> {
    const data = await Trakt.get<TTVSearchResult[]>(
      `/search/${type}?query=${encodeURIComponent(query)}`
    );

    const formatted = await Promise.all(
      // eslint-disable-next-line no-return-await
      data.map(async (v) => await formatTTVSearchResult(v))
    );
    return formatted.map((v) => formatTTVMeta(v));
  }

  public static async getMetaFromId(
    type: MWMediaType,
    id: string,
    seasonId?: string
  ): Promise<DetailedMeta | null> {
    console.log("getMetaFromId", type, id, seasonId);
    return null;
  }
}
