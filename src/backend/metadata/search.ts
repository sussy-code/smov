import { SimpleCache } from "@/utils/cache";

import { Trakt, mediaTypeToTTV } from "./trakttv";
import { MWMediaMeta, MWQuery } from "./types";

const cache = new SimpleCache<MWQuery, MWMediaMeta[]>();
cache.setCompare((a, b) => {
  return a.type === b.type && a.searchQuery.trim() === b.searchQuery.trim();
});
cache.initialize();

export async function searchForMedia(query: MWQuery): Promise<MWMediaMeta[]> {
  if (cache.has(query)) return cache.get(query) as MWMediaMeta[];
  const { searchQuery, type } = query;

  const contentType = mediaTypeToTTV(type);

  const results = await Trakt.search(searchQuery, contentType);
  console.log(results[0]);
  cache.set(query, results, 3600);
  return results;
}
