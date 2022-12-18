import Fuse from "fuse.js";
import {
  MWMassProviderOutput,
  MWMedia,
  MWQuery,
  convertMediaToPortable,
} from "@/providers";
import { SimpleCache } from "@/utils/cache";
import { GetProvidersForType } from "./helpers";
import contentCache from "./contentCache";

// cache
const resultCache = new SimpleCache<MWQuery, MWMassProviderOutput>();
resultCache.setCompare(
  (a, b) => a.searchQuery === b.searchQuery && a.type === b.type
);
resultCache.initialize();

/*
 ** actually call all providers with the search query
 */
async function callProviders(query: MWQuery): Promise<MWMassProviderOutput> {
  const allQueries = GetProvidersForType(query.type).map<
    Promise<{ media: MWMedia[]; success: boolean; id: string }>
  >(async (provider) => {
    try {
      return {
        media: await provider.searchForMedia(query),
        success: true,
        id: provider.id,
      };
    } catch (err) {
      console.error(`Failed running provider ${provider.id}`, err, query);
      return {
        media: [],
        success: false,
        id: provider.id,
      };
    }
  });
  const allResults = await Promise.all(allQueries);
  const providerResults = allResults.map((provider) => ({
    success: provider.success,
    id: provider.id,
  }));
  const output: MWMassProviderOutput = {
    results: allResults.flatMap((results) => results.media),
    providers: providerResults,
    stats: {
      total: providerResults.length,
      failed: providerResults.filter((v) => !v.success).length,
      succeeded: providerResults.filter((v) => v.success).length,
    },
  };

  // save in cache if all successfull
  if (output.stats.failed === 0) {
    resultCache.set(query, output, 60 * 60); // cache for an hour
  }

  output.results.forEach((result: MWMedia) => {
    contentCache.set(convertMediaToPortable(result), result, 60 * 60);
  });

  return output;
}

/*
 ** sort results based on query
 */
function sortResults(
  query: MWQuery,
  providerResults: MWMassProviderOutput
): MWMassProviderOutput {
  const results: MWMassProviderOutput = { ...providerResults };
  const fuse = new Fuse(results.results, {
    threshold: 0.3,
    keys: ["title"],
    fieldNormWeight: 0.5,
  });
  results.results = fuse.search(query.searchQuery).map((v) => v.item);
  return results;
}

/*
 ** Call search on all providers that matches query type
 */
export async function SearchProviders(
  inputQuery: MWQuery
): Promise<MWMassProviderOutput> {
  // input normalisation
  const query = { ...inputQuery };
  query.searchQuery = query.searchQuery.toLowerCase().trim();

  // consult cache first
  let output = resultCache.get(query);
  if (!output) output = await callProviders(query);

  // sort results
  output = sortResults(query, output);

  if (output.stats.total === output.stats.failed)
    throw new Error("All Scrapers failed");
  return output;
}
