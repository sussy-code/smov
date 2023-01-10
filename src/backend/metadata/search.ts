import { MWMediaType, MWQuery } from "@/providers";

const JW_API_BASE = "https://apis.justwatch.com";

type JWContentTypes = "movie" | "show";

type JWSearchQuery = {
  content_types: JWContentTypes[];
  page: number;
  page_size: number;
  query: string;
};

type JWSearchResults = {
  title: string;
  poster?: string;
  id: number;
  original_release_year: number;
  jw_entity_id: string;
};

type JWPage<T> = {
  items: T[];
  page: number;
  page_size: number;
  total_pages: number;
  total_results: number;
};

export type MWSearchResult = {
  title: string;
  id: string;
  year: string;
  poster?: string;
  type: MWMediaType;
};

export async function searchForMedia({
  searchQuery,
  type,
}: MWQuery): Promise<MWSearchResult[]> {
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
  ).then((res) => res.json() as Promise<JWPage<JWSearchResults>>);

  return data.items.map<MWSearchResult>((v) => ({
    title: v.title,
    id: v.id.toString(),
    year: v.original_release_year.toString(),
    poster: v.poster
      ? `https://images.justwatch.com${v.poster.replace("{profile}", "s166")}`
      : undefined,
    type,
  }));
}
