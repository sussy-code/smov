import { useTranslation } from "react-i18next";

export function useRandomTranslation() {
  const { t } = useTranslation();

  const getRandomTranslation = (key: string) => {
    const res = t(key, { returnObjects: true });

    if (Array.isArray(res)) return res[Math.floor(Math.random() * res.length)];

    return res;
  };

  return { t: getRandomTranslation };
}
