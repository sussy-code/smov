import { MWMediaType, MWQuery } from "providers";
import React, { useState } from "react";
import { generatePath, useHistory, useRouteMatch } from "react-router-dom";

export function useSearchQuery(): [MWQuery, (inp: Partial<MWQuery>) => void] {
  const history = useHistory()
  const { path, params } = useRouteMatch<{ type: string, query: string}>()
  const [search, setSearch] = useState<MWQuery>({
    searchQuery: "",
    type: MWMediaType.MOVIE,
  });

  const updateParams = (inp: Partial<MWQuery>) => {
    const copySearch: MWQuery = {...search};
    Object.assign(copySearch, inp);
    history.push(generatePath(path, { query: copySearch.searchQuery.length === 0 ? undefined : inp.searchQuery, type: copySearch.type }))
  }

  React.useEffect(() => {
    const type = Object.values(MWMediaType).find(v=>params.type === v) || MWMediaType.MOVIE;
    const searchQuery = params.query || "";
    setSearch({ type, searchQuery });
  }, [params, setSearch])

  return [search, updateParams]
}
