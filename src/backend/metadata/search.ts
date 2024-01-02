import { SimpleCache } from "@/utils/cache";
import { MediaItem } from "@/utils/mediaTypes";

import {
  formatTMDBMetaToMediaItem,
  formatTMDBSearchResult,
  multiSearch,
} from "./tmdb";
import { MWQuery } from "./types/mw";

const cache = new SimpleCache<MWQuery, MediaItem[]>();
cache.setCompare((a, b) => {
  return a.searchQuery.trim() === b.searchQuery.trim();
});
cache.initialize();

export async function searchForMedia(query: MWQuery): Promise<MediaItem[]> {
  if (cache.has(query)) return cache.get(query) as MediaItem[];
  const { searchQuery } = query;

  const data = await multiSearch(searchQuery);
  const results = data.map((v) => {
    const formattedResult = formatTMDBSearchResult(v, v.media_type);
    return formatTMDBMetaToMediaItem(formattedResult);
  });

  const movieWithPosters = results.filter((movie) => movie.poster);
  const movieWithoutPosters = results.filter((movie) => !movie.poster);

  const sortedresult = movieWithPosters.concat(movieWithoutPosters);

  // cache results for 1 hour
  cache.set(query, sortedresult, 3600);
  return sortedresult;
}
