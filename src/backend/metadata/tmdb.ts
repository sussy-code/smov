import { conf } from "@/setup/config";

import {
  DetailedMeta,
  MWMediaType,
  TMDBMediaStatic,
  TMDBMovieData,
  TMDBShowData,
} from "./types";
import { mwFetch } from "../helpers/fetch";

export abstract class Tmdb {
  private static baseURL = "https://api.themoviedb.org/3";

  private static headers = {
    accept: "application/json",
    Authorization: `Bearer ${conf().TMDB_API_KEY}`,
  };

  private static async get<T>(url: string): Promise<T> {
    const res = await mwFetch<any>(url, {
      headers: Tmdb.headers,
      baseURL: Tmdb.baseURL,
    });
    return res;
  }

  public static getMediaDetails: TMDBMediaStatic["getMediaDetails"] = async (
    id: string,
    type: MWMediaType
  ) => {
    let data;

    switch (type) {
      case "movie":
        data = await Tmdb.get<TMDBMovieData>(`/movie/${id}`);
        break;
      case "series":
        data = await Tmdb.get<TMDBShowData>(`/tv/${id}`);
        break;
      default:
        throw new Error("Invalid media type");
    }

    return data;
  };

  public static getMediaPoster(posterPath: string | null): string | undefined {
    if (posterPath) return `https://image.tmdb.org/t/p/w185/${posterPath}`;
  }

  /* public static async getMetaFromId(
    type: MWMediaType,
    id: string,
    seasonId?: string
  ): Promise<DetailedMeta | null> {
    console.log("getMetaFromId", type, id, seasonId);

    const details = await Tmdb.getMediaDetails(id, type);

    if (!details) return null;

    let imdbId;
    if (type === MWMediaType.MOVIE) {
      imdbId = (details as TMDBMovieData).imdb_id ?? undefined;
    }

    if (!meta.length) return null;

    console.log(meta);

    return {
      meta,
      imdbId,
      tmdbId: id,
    };
  } */
}
