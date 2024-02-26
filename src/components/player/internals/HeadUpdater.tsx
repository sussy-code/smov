import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { usePlayerStore } from "@/stores/player/store";

export function HeadUpdater() {
  const { t } = useTranslation();
  const meta = usePlayerStore((s) => s.meta);

  if (!meta) return null;
  if (meta.type !== "show") {
    return (
      <Helmet>
        <title>{meta.title}</title>
      </Helmet>
    );
  }

  const humanizedEpisodeId = t("media.episodeDisplay", {
    season: meta.season?.number,
    episode: meta.episode?.number,
  });

  return (
    <Helmet>
      <title>
        {meta.title} - {humanizedEpisodeId}
      </title>
    </Helmet>
  );
}
