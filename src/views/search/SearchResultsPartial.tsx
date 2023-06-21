import { useEffect, useMemo, useState } from "react";

import { MWQuery } from "@/backend/metadata/types/mw";
import { useDebounce } from "@/hooks/useDebounce";

import { HomeView } from "./HomeView";
import { SearchLoadingView } from "./SearchLoadingView";
import { SearchResultsView } from "./SearchResultsView";

interface SearchResultsPartialProps {
  search: MWQuery;
}

export function SearchResultsPartial({ search }: SearchResultsPartialProps) {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce<MWQuery>(search, 500);
  useEffect(() => {
    setSearching(search.searchQuery !== "");
    setLoading(search.searchQuery !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  const resultView = useMemo(() => {
    if (loading) return <SearchLoadingView />;
    if (searching) return <SearchResultsView searchQuery={debouncedSearch} />;
    return <HomeView />;
  }, [loading, searching, debouncedSearch]);

  return resultView;
}
