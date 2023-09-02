import { useTranslation } from "react-i18next";

import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useMisc } from "@/_oldvideo/state/logic/misc";
import { Icon, Icons } from "@/components/Icon";

export function CastingTextAction() {
  const { t } = useTranslation();

  const descriptor = useVideoPlayerDescriptor();
  const misc = useMisc(descriptor);

  if (!misc.isCasting) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-denim-200 p-3 brightness-100 grayscale">
        <Icon icon={Icons.CASTING} />
      </div>
      <p className="text-center text-gray-300">{t("casting.casting")}</p>
    </div>
  );
}
