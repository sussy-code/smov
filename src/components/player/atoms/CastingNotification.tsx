import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { usePlayerStore } from "@/stores/player/store";

export function CastingNotification() {
  const { t } = useTranslation();
  const isLoading = usePlayerStore((s) => s.mediaPlaying.isLoading);
  const display = usePlayerStore((s) => s.display);
  const isCasting = display?.getType() === "casting";

  if (isLoading || !isCasting) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-opacity-10 bg-video-buttonBackground p-3 brightness-100 grayscale">
        <Icon icon={Icons.CASTING} />
      </div>
      <p className="text-center">{t("player.casting.enabled")}</p>
    </div>
  );
}
