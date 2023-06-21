import { useState } from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";

import { MWMediaType, MWQuery } from "@/backend/metadata/types/mw";

function getInitialValue(params: { type: string; query: string }) {
  const type =
    Object.values(MWMediaType).find((v) => params.type === v) ||
    MWMediaType.MOVIE;
  const searchQuery = decodeURIComponent(params.query || "");
  return { type, searchQuery };
}

export function useSearchQuery(): [
  MWQuery,
  (inp: Partial<MWQuery>, force: boolean) => void,
  () => void
] {
  const history = useHistory();
  const { path, params } = useRouteMatch<{ type: string; query: string }>();
  const [search, setSearch] = useState<MWQuery>(getInitialValue(params));

  const updateParams = (inp: Partial<MWQuery>, force: boolean) => {
    const copySearch: MWQuery = { ...search };
    Object.assign(copySearch, inp);
    setSearch(copySearch);
    if (!force) return;
    history.replace(
      generatePath(path, {
        query:
          copySearch.searchQuery.length === 0 ? undefined : inp.searchQuery,
        type: copySearch.type,
      })
    );
  };

  const onUnFocus = () => {
    history.replace(
      generatePath(path, {
        query: search.searchQuery.length === 0 ? undefined : search.searchQuery,
        type: search.type,
      })
    );
  };

  return [search, updateParams, onUnFocus];
}
