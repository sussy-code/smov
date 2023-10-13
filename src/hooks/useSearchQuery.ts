import { useEffect, useState } from "react";
import { generatePath, useHistory, useParams } from "react-router-dom";

export function useSearchQuery(): [
  string,
  (inp: string, force?: boolean) => void,
  () => void
] {
  const history = useHistory();
  const params = useParams<{ query: string }>();
  const [search, setSearch] = useState(params.query ?? "");

  useEffect(() => {
    setSearch(params.query ?? "");
  }, [params.query]);

  const updateParams = (inp: string, commitToUrl = false) => {
    setSearch(inp);
    if (!commitToUrl) return;
    if (inp.length === 0) {
      history.replace("/");
      return;
    }
    history.replace(
      generatePath("/browse/:query", {
        query: inp,
      })
    );
  };

  const onUnFocus = () => {
    updateParams(search, true);
  };

  return [search, updateParams, onUnFocus];
}
