import { conf } from "@/setup/config";

import {
  MWMediaMeta,
  MWMediaType,
  MWSeasonMeta,
  TMDBContentTypes,
  TMDBEpisodeShort,
  TMDBExternalIds,
  TMDBMediaResult,
  TMDBMovieData,
  TMDBMovieExternalIds,
  TMDBMovieResponse,
  TMDBMovieResult,
  TMDBSeason,
  TMDBSeasonMetaResult,
  TMDBShowData,
  TMDBShowExternalIds,
  TMDBShowResponse,
  TMDBShowResult,
} from "./types";
import { mwFetch } from "../helpers/fetch";

export function mediaTypeToTMDB(type: MWMediaType): TMDBContentTypes {
  if (type === MWMediaType.MOVIE) return "movie";
  if (type === MWMediaType.SERIES) return "show";
  throw new Error("unsupported type");
}

export function TMDBMediaToMediaType(type: string): MWMediaType {
  if (type === "movie") return MWMediaType.MOVIE;
  if (type === "show") return MWMediaType.SERIES;
  throw new Error("unsupported type");
}

export function formatTMDBMeta(
  media: TMDBMediaResult,
  season?: TMDBSeasonMetaResult
): MWMediaMeta {
  const type = TMDBMediaToMediaType(media.object_type);
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

export function TMDBMediaToId(media: MWMediaMeta): string {
  return ["tmdb", mediaTypeToTMDB(media.type), media.id].join("-");
}

export function decodeTMDBId(
  paramId: string
): { id: string; type: MWMediaType } | null {
  const [prefix, type, id] = paramId.split("-", 3);
  if (prefix !== "tmdb") return null;
  let mediaType;
  try {
    mediaType = TMDBMediaToMediaType(type);
  } catch {
    return null;
  }
  return {
    type: mediaType,
    id,
  };
}

const baseURL = "https://api.themoviedb.org/3";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${conf().TMDB_API_KEY}`,
};

async function get<T>(url: string): Promise<T> {
  const res = await mwFetch<any>(url, {
    headers,
    baseURL,
  });
  return res;
}

export async function searchMedia(query: string, type: TMDBContentTypes) {
  let data;

  switch (type) {
    case "movie":
      data = await get<TMDBMovieResponse>(
        `search/movie?query=${query}&include_adult=false&language=en-US&page=1`
      );
      break;
    case "show":
      data = await get<TMDBShowResponse>(
        `search/tv?query=${query}&include_adult=false&language=en-US&page=1`
      );
      break;
    default:
      throw new Error("Invalid media type");
  }

  return data;
}

export async function getMediaDetails(id: string, type: TMDBContentTypes) {
  let data;

  switch (type) {
    case "movie":
      data = await get<TMDBMovieData>(`/movie/${id}`);
      break;
    case "show":
      data = await get<TMDBShowData>(`/tv/${id}`);
      break;
    default:
      throw new Error("Invalid media type");
  }

  return data;
}

export function getMediaPoster(posterPath: string | null): string | undefined {
  if (posterPath) return `https://image.tmdb.org/t/p/w185/${posterPath}`;
}

export async function getEpisodes(
  id: string,
  season: number
): Promise<TMDBEpisodeShort[]> {
  const data = await get<TMDBSeason>(`/tv/${id}/season/${season}`);
  return data.episodes.map((e) => ({
    id: e.id,
    episode_number: e.episode_number,
    title: e.name,
  }));
}

export async function getExternalIds(
  id: string,
  type: TMDBContentTypes
): Promise<TMDBExternalIds> {
  let data;

  switch (type) {
    case "movie":
      data = await get<TMDBMovieExternalIds>(`/movie/${id}/external_ids`);
      break;
    case "show":
      data = await get<TMDBShowExternalIds>(`/tv/${id}/external_ids`);
      break;
    default:
      throw new Error("Invalid media type");
  }

  return data;
}

export async function formatTMDBSearchResult(
  result: TMDBShowResult | TMDBMovieResult,
  mediatype: TMDBContentTypes
): Promise<TMDBMediaResult> {
  const type = TMDBMediaToMediaType(mediatype);

  return {
    title:
      type === MWMediaType.SERIES
        ? (result as TMDBShowResult).name
        : (result as TMDBMovieResult).title,
    poster: getMediaPoster(result.poster_path),
    id: result.id,
    original_release_year:
      type === MWMediaType.SERIES
        ? Number((result as TMDBShowResult).first_air_date?.split("-")[0])
        : Number((result as TMDBMovieResult).release_date?.split("-")[0]),
    object_type: mediaTypeToTMDB(type),
  };
}
