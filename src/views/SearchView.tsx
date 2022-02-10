import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { SearchBarInput } from "@/components/SearchBar";
import { MWMedia, MWMediaType, SearchProviders } from "@/scrapers";
import { useState } from "react";

export function SearchView() {
  const [results, setResults] = useState<MWMedia[]>([]);
  const [search, setSearch] = useState("");

  async function runSearch() {
    const results = await SearchProviders({ type: MWMediaType.MOVIE, searchQuery: search });
    setResults(results);
  }

  return (
    <div>
      <h1>Search</h1>
      <SearchBarInput onChange={setSearch} value={search} onClick={runSearch}/>
      <h1 className="bg-red-500">Search results</h1>
      {results.map((v)=>(<WatchedMediaCard media={v} />))}
    </div>
  )
}
