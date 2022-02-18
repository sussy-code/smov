import { WatchedMediaCard } from "components/media/WatchedMediaCard";
import { SearchBarInput } from "components/SearchBar";
import {
  MWMassProviderOutput,
  MWMedia,
  MWMediaType,
  MWQuery,
  SearchProviders,
} from "providers";
import { useEffect, useState } from "react";
import { ThinContainer } from "components/layout/ThinContainer";
import { SectionHeading } from "components/layout/SectionHeading";
import { Icons } from "components/Icon";
import { Loading } from "components/layout/Loading";
import { Tagline } from "components/Text/Tagline";
import { Title } from "components/Text/Title";
import { useDebounce } from "hooks/useDebounce";
import { useLoading } from "hooks/useLoading";
import { IconPatch } from "components/Buttons/IconPatch";

function SearchLoading() {
  throw new Error("testing");
  return <Loading className="my-12" text="Fetching your favourite shows..." />;
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
              {props.fails}/{props.total} providers failed
            </p>
          ) : null}
          {props.resultsSize > 0 ? (
            <p>That's all we have &mdash; sorry</p>
          ) : (
            <p>We couldn't find anything &mdash; sorry</p>
          )}
        </div>
      ) : null}

      {/* Error result */}
      {allFailed ? (
        <div>
          <p>All providers failed &mdash; whoops</p>
        </div>
      ) : null}
    </div>
  );
}

function SearchResultsView({ searchQuery }: { searchQuery: MWQuery }) {
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
        <SectionHeading title="Search results" icon={Icons.SEARCH}>
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
  const [search, setSearch] = useState<MWQuery>({
    searchQuery: "",
    type: MWMediaType.MOVIE,
  });

  const debouncedSearch = useDebounce<MWQuery>(search, 2000);
  useEffect(() => {
    setSearching(search.searchQuery !== "");
    setLoading(search.searchQuery !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return (
    <ThinContainer>
      {/* input section */}
      <div className="mt-36 space-y-16 text-center">
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
        <SearchResultsView searchQuery={debouncedSearch} />
      ) : null}
    </ThinContainer>
  );
}
