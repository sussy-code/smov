import {
  formatJWMeta,
  JWContentTypes,
  JWMediaResult,
  JW_API_BASE,
} from "./justwatch";
import { MWMediaMeta, MWMediaType, MWQuery } from "./types";

type JWSearchQuery = {
  content_types: JWContentTypes[];
  page: number;
  page_size: number;
  query: string;
};

type JWPage<T> = {
  items: T[];
  page: number;
  page_size: number;
  total_pages: number;
  total_results: number;
};

export async function searchForMedia({
  searchQuery,
  type,
}: MWQuery): Promise<MWMediaMeta[]> {
  const body: JWSearchQuery = {
    content_types: [],
    page: 1,
    query: searchQuery,
    page_size: 40,
  };
  if (type === MWMediaType.MOVIE) body.content_types.push("movie");
  else if (type === MWMediaType.SERIES) body.content_types.push("show");
  else if (type === MWMediaType.ANIME)
    throw new Error("Anime search type is not supported");

  const data = await fetch(
    `${JW_API_BASE}/content/titles/en_US/popular?body=${encodeURIComponent(
      JSON.stringify(body)
    )}`
  ).then((res) => res.json() as Promise<JWPage<JWMediaResult>>);

  return data.items.map<MWMediaMeta>((v) => formatJWMeta(v));
}
