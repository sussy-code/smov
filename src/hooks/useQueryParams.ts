import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useQueryParams() {
  const loc = useLocation();

  const queryParams = useMemo(() => {
    const obj: Record<string, string> = Object.fromEntries(
      new URLSearchParams(loc.search).entries(),
    );

    return obj;
  }, [loc.search]);

  return queryParams;
}

export function useQueryParam(
  param: string,
): [string | null, (a: string | null) => void] {
  const params = useQueryParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentValue = params[param] ?? null;

  const set = useCallback(
    (value: string | null) => {
      const parsed = new URLSearchParams(location.search);
      if (value) parsed.set(param, value);
      else parsed.delete(param);
      navigate({
        search: parsed.toString(),
      });
    },
    [param, location.search, navigate],
  );

  return [currentValue, set];
}
