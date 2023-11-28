import { t } from "i18next";
import { useCallback } from "react";
import { Trans } from "react-i18next";

import { Toggle } from "@/components/buttons/Toggle";
import { Menu } from "@/components/player/internals/ContextMenu";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import {
  SourceQuality,
  allQualities,
  qualityToString,
} from "@/stores/player/utils/qualities";
import { useQualityStore } from "@/stores/quality";

const alwaysVisibleQualities: Record<SourceQuality, boolean> = {
  unknown: false,
  "360": true,
  "480": true,
  "720": true,
  "1080": true,
};

export function QualityView({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const availableQualities = usePlayerStore((s) => s.qualities);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const switchQuality = usePlayerStore((s) => s.switchQuality);
  const enableAutomaticQuality = usePlayerStore(
    (s) => s.enableAutomaticQuality
  );
  const setAutomaticQuality = useQualityStore((s) => s.setAutomaticQuality);
  const setLastChosenQuality = useQualityStore((s) => s.setLastChosenQuality);
  const autoQuality = useQualityStore((s) => s.quality.automaticQuality);

  const change = useCallback(
    (q: SourceQuality) => {
      setLastChosenQuality(q);
      setAutomaticQuality(false);
      switchQuality(q);
      router.close();
    },
    [router, switchQuality, setLastChosenQuality, setAutomaticQuality]
  );

  const changeAutomatic = useCallback(() => {
    const newValue = !autoQuality;
    setAutomaticQuality(newValue);
    if (newValue) enableAutomaticQuality();
  }, [setAutomaticQuality, autoQuality, enableAutomaticQuality]);

  const visibleQualities = allQualities.filter((quality) => {
    if (alwaysVisibleQualities[quality]) return true;
    if (availableQualities.includes(quality)) return true;
    return false;
  });

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        {t("player.menus.quality.title")}
      </Menu.BackLink>
      <Menu.Section>
        {visibleQualities.map((v) => (
          <SelectableLink
            key={v}
            selected={v === currentQuality}
            onClick={
              availableQualities.includes(v) ? () => change(v) : undefined
            }
            disabled={!availableQualities.includes(v)}
          >
            {qualityToString(v)}
          </SelectableLink>
        ))}
        <Menu.Divider />
        <Menu.Link
          rightSide={<Toggle onClick={changeAutomatic} enabled={autoQuality} />}
        >
          {t("player.menus.quality.automaticLabel")}
        </Menu.Link>
        <Menu.SmallText>
          <Trans i18nKey="player.menus.quality.hint">
            <Menu.Anchor onClick={() => router.navigate("/source")}>
              text
            </Menu.Anchor>
          </Trans>
        </Menu.SmallText>
      </Menu.Section>
    </>
  );
}
