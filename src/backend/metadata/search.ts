import { SimpleCache } from "@/utils/cache";

import { formatTMDBMeta, formatTMDBSearchResult, multiSearch } from "./tmdb";
import { MWMediaMeta, MWQuery } from "./types/mw";

const cache = new SimpleCache<MWQuery, MWMediaMeta[]>();
cache.setCompare((a, b) => {
  return a.type === b.type && a.searchQuery.trim() === b.searchQuery.trim();
});
cache.initialize();

export async function searchForMedia(query: MWQuery): Promise<MWMediaMeta[]> {
  if (cache.has(query)) return cache.get(query) as MWMediaMeta[];
  const { searchQuery } = query;

  const data = await multiSearch(searchQuery);
  const results = data.map((v) => {
    const formattedResult = formatTMDBSearchResult(v, v.media_type);
    return formatTMDBMeta(formattedResult);
  });

  cache.set(query, results, 3600); // cache results for 1 hour
  return results;
}
