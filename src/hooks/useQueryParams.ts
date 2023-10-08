import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQueryParams() {
  const loc = useLocation();

  const queryParams = useMemo(() => {
    // Basic absolutely-not-fool-proof URL query param parser
    const obj: Record<string, string> = Object.fromEntries(
      new URLSearchParams(loc.search).entries()
    );

    return obj;
  }, [loc]);

  return queryParams;
}

export function useQueryParam(param: string) {
  const params = useQueryParams();
  const location = useLocation();
  const currentValue = params[param];

  const set = useCallback(
    (value: string | null) => {
      const parsed = new URLSearchParams(location.search);
      if (value) parsed.set(param, value);
      else parsed.delete(param);
      location.search = parsed.toString();
    },
    [param, location]
  );

  return [currentValue, set] as const;
}
