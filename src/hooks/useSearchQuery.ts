import React, { useRef, useState } from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";
import { MWMediaType, MWQuery } from "@/providers";

export function useSearchQuery(): [
  MWQuery,
  (inp: Partial<MWQuery>, force: boolean) => void,
  () => void
] {
  const history = useHistory();
  const isFirstRender = useRef(true);
  const { path, params } = useRouteMatch<{ type: string; query: string }>();
  const [search, setSearch] = useState<MWQuery>({
    searchQuery: "",
    type: MWMediaType.MOVIE,
  });

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

  // only run on first load of the page
  React.useEffect(() => {
    if (isFirstRender.current === false) {
      return;
    }
    isFirstRender.current = false;
    const type =
      Object.values(MWMediaType).find((v) => params.type === v) ||
      MWMediaType.MOVIE;
    const searchQuery = params.query || "";
    setSearch({ type, searchQuery });
  }, [setSearch, params, isFirstRender]);

  return [search, updateParams, onUnFocus];
}
