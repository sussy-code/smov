import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// 10% chance of getting a joke title
const shouldGiveJokeTitle = () => Math.floor(Math.random() * 10) === 0;

export function useRandomTranslation() {
  const { t } = useTranslation();
  const seed = useMemo(() => Math.random(), []);

  const getRandomTranslation = useCallback(
    (key: string): string => {
      const shouldRandom = shouldGiveJokeTitle();
      const defaultTitle = t(`${key}.default`) ?? "";
      if (!shouldRandom) return defaultTitle;

      const keys = t(`${key}.extra`, { returnObjects: true });
      if (Array.isArray(keys)) {
        if (keys.length === 0) return defaultTitle;
        return keys[Math.floor(seed * keys.length)];
      }

      return typeof keys === "string" ? keys : defaultTitle;
    },
    [t, seed]
  );

  return { t: getRandomTranslation };
}
