import { WatchedMediaCard } from "components/media/WatchedMediaCard";
import { SearchBarInput } from "components/SearchBar";
import { MWMassProviderOutput, MWQuery, SearchProviders } from "providers";
import { useEffect, useState } from "react";
import { ThinContainer } from "components/layout/ThinContainer";
import { SectionHeading } from "components/layout/SectionHeading";
import { Icons } from "components/Icon";
import { Loading } from "components/layout/Loading";
import { Tagline } from "components/text/Tagline";
import { Title } from "components/text/Title";
import { useDebounce } from "hooks/useDebounce";
import { useLoading } from "hooks/useLoading";
import { IconPatch } from "components/buttons/IconPatch";
import { Navigation } from "components/layout/Navigation";
import { useSearchQuery } from "hooks/useSearchQuery";
import { useWatchedContext } from "state/watched/context";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "state/bookmark/context";

function SearchLoading() {
  return <Loading className="my-24" text="Fetching your favourite shows..." />;
}

function SearchSuffix(props: {
  fails: number;
  total: number;
  resultsSize: number;
}) {
  const allFailed: boolean = props.fails === props.total;
  const icon: Icons = allFailed ? Icons.WARNING : Icons.EYE_SLASH;

  return (
    <div className="my-24 flex flex-col items-center justify-center space-y-3 text-center">
      <IconPatch
        icon={icon}
        className={`text-xl ${allFailed ? "text-red-400" : "text-bink-600"}`}
      />

      {/* standard suffix */}
      {!allFailed ? (
        <div>
          {props.fails > 0 ? (
            <p className="text-red-400">
              {props.fails}/{props.total} providers failed!
            </p>
          ) : null}
          {props.resultsSize > 0 ? (
            <p>That's all we have!</p>
          ) : (
            <p>We couldn't find anything!</p>
          )}
        </div>
      ) : null}

      {/* Error result */}
      {allFailed ? (
        <div>
          <p>All providers have failed!</p>
        </div>
      ) : null}
    </div>
  );
}

function SearchResultsView({
  searchQuery,
  clear,
}: {
  searchQuery: MWQuery;
  clear: () => void;
}) {
  const [results, setResults] = useState<MWMassProviderOutput | undefined>();
  const [runSearchQuery, loading, error, success] = useLoading(
    (query: MWQuery) => SearchProviders(query)
  );

  useEffect(() => {
    if (searchQuery.searchQuery !== "") runSearch(searchQuery);
  }, [searchQuery]);

  async function runSearch(query: MWQuery) {
    const results = await runSearchQuery(query);
    if (!results) return;
    setResults(results);
  }

  return (
    <div>
      {/* results */}
      {success && results?.results.length ? (
        <SectionHeading
          title="Search results"
          icon={Icons.SEARCH}
          linkText="Back to home"
          onClick={() => clear()}
        >
          {results.results.map((v) => (
            <WatchedMediaCard
              key={[v.mediaId, v.providerId].join("|")}
              media={v}
            />
          ))}
        </SectionHeading>
      ) : null}

      {/* search suffix */}
      {success && results ? (
        <SearchSuffix
          resultsSize={results.results.length}
          fails={results.stats.failed}
          total={results.stats.total}
        />
      ) : null}

      {/* error */}
      {error ? <SearchSuffix resultsSize={0} fails={1} total={1} /> : null}

      {/* Loading icon */}
      {loading ? <SearchLoading /> : null}
    </div>
  );
}

export function SearchView() {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useSearchQuery();

  const debouncedSearch = useDebounce<MWQuery>(search, 2000);
  useEffect(() => {
    setSearching(search.searchQuery !== "");
    setLoading(search.searchQuery !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return (
    <>
      <Navigation />
      <ThinContainer>
        {/* input section */}
        <div className="mt-44 space-y-16 text-center">
          <div className="space-y-4">
            <Tagline>Because watching legally is boring</Tagline>
            <Title>What movie do you want to watch?</Title>
          </div>
          <SearchBarInput
            onChange={setSearch}
            value={search}
            placeholder="What movie do you want to watch?"
          />
        </div>

        {/* results view */}
        {loading ? (
          <SearchLoading />
        ) : searching ? (
          <SearchResultsView
            searchQuery={debouncedSearch}
            clear={() => setSearch({ searchQuery: "" })}
          />
        ) : (
          <ExtraItems />
        )}
      </ThinContainer>
    </>
  );
}

function ExtraItems() {
  const { bookmarkStore } = useBookmarkContext();
  const { watched } = useWatchedContext();
  const watchedItems = watched.items.filter(
    (v) => !getIfBookmarkedFromPortable(bookmarkStore, v)
  );

  if (watchedItems.length === 0 && bookmarkStore.bookmarks.length === 0)
    return null;

  return (
    <div className="mb-16 mt-32">
      {bookmarkStore.bookmarks.length > 0 ? (
        <SectionHeading title="Bookmarks" icon={Icons.BOOKMARK}>
          {bookmarkStore.bookmarks.map((v) => (
            <WatchedMediaCard
              key={[v.mediaId, v.providerId].join("|")}
              media={v}
            />
          ))}
        </SectionHeading>
      ) : null}
      {watchedItems.length > 0 ? (
        <SectionHeading title="Continue Watching" icon={Icons.CLOCK}>
          {watchedItems.map((v) => (
            <WatchedMediaCard
              key={[v.mediaId, v.providerId].join("|")}
              media={v}
            />
          ))}
        </SectionHeading>
      ) : null}
    </div>
  );
}
