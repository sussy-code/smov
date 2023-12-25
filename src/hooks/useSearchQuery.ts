import { useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

function decode(query: string | null | undefined) {
  return query ? decodeURIComponent(query) : "";
}

export function useSearchQuery(): [
  string,
  (inp: string, force?: boolean) => void,
  () => void,
] {
  const navigate = useNavigate();
  const params = useParams<{ query: string }>();
  const [search, setSearch] = useState(decode(params.query));

  useEffect(() => {
    setSearch(decode(params.query));
  }, [params.query]);

  const updateParams = (inp: string, commitToUrl = false) => {
    setSearch(inp);
    if (!commitToUrl) return;
    if (inp.length === 0) {
      navigate("/", { replace: true });
      return;
    }
    navigate(
      generatePath("/browse/:query", {
        query: inp,
      }),
      { replace: true },
    );
  };

  const onUnFocus = () => {
    updateParams(search, true);
  };

  return [search, updateParams, onUnFocus];
}
