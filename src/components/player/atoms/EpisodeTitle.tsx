import { useTranslation } from "react-i18next";

import { usePlayerStore } from "@/stores/player/store";

export function EpisodeTitle() {
  const { t } = useTranslation();
  const meta = usePlayerStore((s) => s.meta);

  if (meta?.type !== "show") return null;

  return (
    <div>
      <span className="text-white font-medium mr-3">
        {t("seasons.seasonAndEpisode", {
          season: meta?.season?.number,
          episode: meta?.episode?.number,
        })}
      </span>
      <span className="text-type-secondary font-medium">
        {meta?.episode?.title}
      </span>
    </div>
  );
}
