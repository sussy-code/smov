import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useRandomTranslation() {
  const { t } = useTranslation();
  const seed = useMemo(() => Math.random(), []);

  const getRandomTranslation = useCallback(
    (key: string) => {
      const res = t(key, { returnObjects: true });

      if (Array.isArray(res)) {
        return res[Math.floor(seed * res.length)];
      }

      return res;
    },
    [t, seed]
  );

  return { t: getRandomTranslation };
}
