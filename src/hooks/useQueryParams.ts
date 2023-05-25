import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQueryParams() {
  const loc = useLocation();

  const queryParams = useMemo(() => {
    // Basic absolutely-not-fool-proof URL query param parser
    const obj: Record<string, string | number> = {};
    for (const [key, value] of loc.search
      .slice(1)
      .split("&")
      .map((e) => e.split("="))) {
      const valueAsNum = Number(value);
      obj[key] = Number.isNaN(valueAsNum) ? value : valueAsNum;
    }

    return obj;
  }, [loc]);

  return queryParams;
}
