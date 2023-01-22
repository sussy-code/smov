import { SimpleCache } from "@/utils/cache";
import { proxiedFetch } from "../helpers/fetch";
import {
  formatJWMeta,
  JWContentTypes,
  JWMediaResult,
  JW_API_BASE,
  mediaTypeToJW,
} from "./justwatch";
import { MWMediaMeta, MWQuery } from "./types";

const cache = new SimpleCache<MWQuery, MWMediaMeta[]>();
cache.setCompare((a, b) => {
  return a.type === b.type && a.searchQuery.trim() === b.searchQuery.trim();
});
cache.initialize();

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

export async function searchForMedia(query: MWQuery): Promise<MWMediaMeta[]> {
  if (cache.has(query)) return cache.get(query) as MWMediaMeta[];
  const { searchQuery, type } = query;

  const contentType = mediaTypeToJW(type);
  const body: JWSearchQuery = {
    content_types: [contentType],
    page: 1,
    query: searchQuery,
    page_size: 40,
  };

  const data = await proxiedFetch<JWPage<JWMediaResult>>(
    "/content/titles/en_US/popular",
    {
      baseURL: JW_API_BASE,
      params: {
        body: JSON.stringify(body),
      },
    }
  );

  const returnData = data.items.map<MWMediaMeta>((v) => formatJWMeta(v));
  cache.set(query, returnData, 3600); // cache for an hour
  return returnData;
}
