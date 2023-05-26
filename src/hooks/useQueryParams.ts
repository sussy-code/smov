import { useMemo } from "react";
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
