import { SimpleCache } from "@/utils/cache";

import {
  formatTMDBMeta,
  formatTMDBSearchResult,
  mediaTypeToTMDB,
  searchMedia,
} from "./tmdb";
import { MWMediaMeta, MWQuery } from "./types";

const cache = new SimpleCache<MWQuery, MWMediaMeta[]>();
cache.setCompare((a, b) => {
  return a.type === b.type && a.searchQuery.trim() === b.searchQuery.trim();
});
cache.initialize();

export async function searchForMedia(query: MWQuery): Promise<MWMediaMeta[]> {
  if (cache.has(query)) return cache.get(query) as MWMediaMeta[];
  const { searchQuery, type } = query;

  const data = await searchMedia(searchQuery, mediaTypeToTMDB(type));
  const results = await Promise.all(
    data.results.map(async (v) => {
      const formattedResult = await formatTMDBSearchResult(
        v,
        mediaTypeToTMDB(type)
      );
      return formatTMDBMeta(formattedResult);
    })
  );

  cache.set(query, results, 3600); // cache results for 1 hour
  return results;
}
