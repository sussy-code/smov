import { useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";

import { MWQuery } from "@/backend/metadata/types/mw";
import { useQueryParams } from "@/hooks/useQueryParams";

function getInitialValue(
  query: Record<string, string>,
  params: Record<string, string>
) {
  let searchQuery = decodeURIComponent(params.query || "");
  if (query.q) searchQuery = query.q;
  return { searchQuery };
}

export function useSearchQuery(): [
  MWQuery,
  (inp: Partial<MWQuery>, force: boolean) => void,
  () => void
] {
  const history = useHistory();
  const query = useQueryParams();
  const params = useParams<{ query: string }>();
  const [search, setSearch] = useState<MWQuery>(getInitialValue(query, params));

  const updateParams = (inp: Partial<MWQuery>, force: boolean) => {
    const copySearch = { ...search };
    Object.assign(copySearch, inp);
    setSearch(copySearch);
    if (!force) return;
    if (copySearch.searchQuery.length === 0) {
      history.replace("/");
      return;
    }
    history.replace(
      generatePath("/browse/:query", {
        query: copySearch.searchQuery,
      })
    );
  };

  const onUnFocus = () => {
    if (search.searchQuery.length === 0) {
      history.replace("/");
      return;
    }
    history.replace(
      generatePath("/browse/:query", {
        query: search.searchQuery,
      })
    );
  };

  return [search, updateParams, onUnFocus];
}
