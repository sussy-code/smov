import { WatchedMediaCard } from "components/media/WatchedMediaCard";
import { SearchBarInput } from "components/SearchBar";
import { MWMedia, MWMediaType, MWQuery, SearchProviders } from "providers";
import { useEffect, useState } from "react";
import { ThinContainer } from "components/layout/ThinContainer";
import { SectionHeading } from "components/layout/SectionHeading";
import { Icons } from "components/Icon";
import { Loading } from "components/layout/Loading";
import { Tagline } from "components/Text/Tagline";
import { Title } from "components/Text/Title";
import { useDebounce } from "hooks/useDebounce";
import { useLoading } from "hooks/useLoading";

function SearchLoading() {
  return <Loading className="my-12" text="Fetching your favourite shows..." />;
}

function SearchResultsView({ searchQuery }: { searchQuery: MWQuery }) {
  const [results, setResults] = useState<MWMedia[]>([]);
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
      {success && results.length > 0 ? (
        <SectionHeading title="Search results" icon={Icons.SEARCH}>
          {results.map((v) => (
            <WatchedMediaCard
              key={[v.mediaId, v.providerId].join("|")}
              media={v}
            />
          ))}
        </SectionHeading>
      ) : null}

      {/* no results */}
      {success && results.length === 0 ? <p>No results found</p> : null}

      {/* error */}
      {error ? <p>All scrapers failed</p> : null}

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
