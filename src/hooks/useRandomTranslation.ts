import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// 10% chance of getting a joke title
const shouldGiveJokeTitle = () => Math.floor(Math.random() * 10) === 0;

export function useRandomTranslation() {
  const { t } = useTranslation();
  const shouldJoke = useMemo(() => shouldGiveJokeTitle(), []);
  const seed = useMemo(() => Math.random(), []);

  const getRandomTranslation = useCallback(
    (key: string): string => {
      const defaultTitle = t(`${key}.default`) ?? "";
      if (!shouldJoke) return defaultTitle;

      const keys = t(`${key}.extra`, {
        returnObjects: true,
        defaultValue: defaultTitle,
      });
      if (Array.isArray(keys)) {
        if (keys.length === 0) return defaultTitle;
        return keys[Math.floor(seed * keys.length)];
      }

      return typeof keys === "string" ? keys : defaultTitle;
    },
    [t, seed, shouldJoke],
  );

  return { t: getRandomTranslation };
}
