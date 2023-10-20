import { useCallback } from "react";

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

  const allVisibleQualities = allQualities.filter((t) => t !== "unknown");

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/")}>
        Quality
      </Menu.BackLink>
      <Menu.Section>
        {allVisibleQualities.map((v) => (
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
          Automatic quality
        </Menu.Link>
        <Menu.SmallText>
          You can try{" "}
          <Menu.Anchor onClick={() => router.navigate("/source")}>
            switching source
          </Menu.Anchor>{" "}
          to get different quality options.
        </Menu.SmallText>
      </Menu.Section>
    </>
  );
}
