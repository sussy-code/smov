import { useEffect, useMemo, useState } from "react";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { SearchBarInput } from "@/components/SearchBar";
import { MWMassProviderOutput, MWQuery, SearchProviders } from "@/providers";
import { ThinContainer } from "@/components/layout/ThinContainer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Icons } from "@/components/Icon";
import { Loading } from "@/components/layout/Loading";
import { Tagline } from "@/components/text/Tagline";
import { Title } from "@/components/text/Title";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Navigation } from "@/components/layout/Navigation";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useWatchedContext } from "@/state/watched/context";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark/context";
import { useTranslation } from "react-i18next";

function SearchLoading() {
  const { t } = useTranslation();
  return <Loading className="my-24" text={t('search.loading') || "Fetching your favourite shows..."} />;
}

function SearchSuffix(props: {
  fails: number;
  total: number;
  resultsSize: number;
}) {
  const { t } = useTranslation();

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
              {t('search.providersFailed', { fails: props.fails, total: props.total })}
            </p>
          ) : null}
          {props.resultsSize > 0 ? (
            <p>{t('search.allResults')}</p>
          ) : (
            <p>{t('search.noResults')}</p>
          )}
        </div>
      ) : null}

      {/* Error result */}
      {allFailed ? (
        <div>
          <p>{t('search.allFailed')}</p>
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
  const { t } = useTranslation();

  const [results, setResults] = useState<MWMassProviderOutput | undefined>();
  const [runSearchQuery, loading, error, success] = useLoading(
    (query: MWQuery) => SearchProviders(query)
  );

  useEffect(() => {
    async function runSearch(query: MWQuery) {
      const searchResults = await runSearchQuery(query);
      if (!searchResults) return;
      setResults(searchResults);
    }

    if (searchQuery.searchQuery !== "") runSearch(searchQuery);
  }, [searchQuery, runSearchQuery]);

  return (
    <div>
      {/* results */}
      {success && results?.results.length ? (
        <SectionHeading
          title={t('search.headingTitle') || "Search results"}
          icon={Icons.SEARCH}
          linkText={t('search.headingLink') || "Back to home"}
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

function ExtraItems() {
  const { t } = useTranslation();

  const { getFilteredBookmarks } = useBookmarkContext();
  const { getFilteredWatched } = useWatchedContext();

  const bookmarks = getFilteredBookmarks();

  const watchedItems = getFilteredWatched().filter(
    (v) => !getIfBookmarkedFromPortable(bookmarks, v)
  );

  if (watchedItems.length === 0 && bookmarks.length === 0) return null;

  return (
    <div className="mb-16 mt-32">
      {bookmarks.length > 0 ? (
        <SectionHeading title={t('search.bookmarks') || "Bookmarks"} icon={Icons.BOOKMARK}>
          {bookmarks.map((v) => (
            <WatchedMediaCard
              key={[v.mediaId, v.providerId].join("|")}
              media={v}
            />
          ))}
        </SectionHeading>
      ) : null}
      {watchedItems.length > 0 ? (
        <SectionHeading title={t('search.continueWatching') || "Continue Watching"} icon={Icons.CLOCK}>
          {watchedItems.map((v) => (
            <WatchedMediaCard
              key={[v.mediaId, v.providerId].join("|")}
              media={v}
              series
            />
          ))}
        </SectionHeading>
      ) : null}
    </div>
  );
}

export function SearchView() {
  const { t } = useTranslation();

  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch, setSearchUnFocus] = useSearchQuery();

  const debouncedSearch = useDebounce<MWQuery>(search, 2000);
  useEffect(() => {
    setSearching(search.searchQuery !== "");
    setLoading(search.searchQuery !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  const resultView = useMemo(() => {
    if (loading) return <SearchLoading />;
    if (searching)
      return (
        <SearchResultsView
          searchQuery={debouncedSearch}
          clear={() => setSearch({ searchQuery: "" }, true)}
        />
      );
    return <ExtraItems />;
  }, [loading, searching, debouncedSearch, setSearch]);

  return (
    <>
      <Navigation />
      <ThinContainer>
        {/* input section */}
        <div className="mt-44 space-y-16 text-center">
          <div className="space-y-4">
            <Tagline>{t('search.tagline')}</Tagline>
            <Title>{t('search.title')}</Title>
          </div>
          <SearchBarInput
            onChange={setSearch}
            value={search}
            onUnFocus={setSearchUnFocus}
            placeholder={t('search.placeholder') || "What do you want to watch?"}
          />
        </div>

        {/* results view */}
        {resultView}
      </ThinContainer>
    </>
  );
}
