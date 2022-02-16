import { WatchedMediaCard } from "components/media/WatchedMediaCard";
import { SearchBarInput } from "components/SearchBar";
import { MWMedia, MWMediaType, MWQuery, SearchProviders } from "scrapers";
import { useEffect, useState } from "react";
import { ThinContainer } from "components/layout/ThinContainer";
import { SectionHeading } from "components/layout/SectionHeading";
import { Icons } from "components/Icon";
import { Loading } from "components/layout/Loading";
import { Tagline } from "components/Text/Tagline";
import { Title } from "components/Text/Title";
import { useDebounce } from "hooks/useDebounce";

export function SearchView() {
  const [results, setResults] = useState<MWMedia[]>([]);
  const [search, setSearch] = useState<MWQuery>({
    searchQuery: "",
    type: MWMediaType.MOVIE,
  });

  const debouncedSearch = useDebounce<MWQuery>(search, 2000);
  useEffect(() => {
    if (debouncedSearch.searchQuery !== "") runSearch(debouncedSearch);
  }, [debouncedSearch]);
  useEffect(() => {
    setResults([]);
  }, [search]);

  async function runSearch(query: MWQuery) {
    const results = await SearchProviders(query);
    setResults(results);
  }

  return (
    <ThinContainer>
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
      {results.length > 0 ? (
        <SectionHeading title="Search results" icon={Icons.SEARCH}>
          {results.map((v) => (
            <WatchedMediaCard media={v} />
          ))}
        </SectionHeading>
      ) : null}
      {search.searchQuery !== "" && results.length === 0 ? <Loading /> : null}
    </ThinContainer>
  );
}
