import { useMemo, useState } from "react";

import { Toggle } from "@/components/buttons/Toggle";
import { Icons } from "@/components/Icon";
import { Context } from "@/components/player/internals/ContextUtils";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { qualityToString } from "@/stores/player/utils/qualities";
import { providers } from "@/utils/providers";

export function SettingsMenu({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const currentSourceId = usePlayerStore((s) => s.sourceId);
  const sourceName = useMemo(() => {
    if (!currentSourceId) return "...";
    return providers.getMetadata(currentSourceId)?.name ?? "...";
  }, [currentSourceId]);

  const [tmpBool, setTmpBool] = useState(false);

  function toggleBool() {
    setTmpBool(!tmpBool);
  }

  return (
    <Context.Card>
      <Context.SectionTitle>Video settings</Context.SectionTitle>
      <Context.Section>
        <Context.Link onClick={() => router.navigate("/quality")}>
          <Context.LinkTitle>Quality</Context.LinkTitle>
          <Context.LinkChevron>
            {currentQuality ? qualityToString(currentQuality) : ""}
          </Context.LinkChevron>
        </Context.Link>
        <Context.Link onClick={() => router.navigate("/source")}>
          <Context.LinkTitle>Video source</Context.LinkTitle>
          <Context.LinkChevron>{sourceName}</Context.LinkChevron>
        </Context.Link>
        <Context.Link>
          <Context.LinkTitle>Download</Context.LinkTitle>
          <Context.IconButton icon={Icons.DOWNLOAD} />
        </Context.Link>
      </Context.Section>

      <Context.SectionTitle>Viewing Experience</Context.SectionTitle>
      <Context.Section>
        <Context.Link>
          <Context.LinkTitle>Enable Captions</Context.LinkTitle>
          <Toggle enabled={tmpBool} onClick={() => toggleBool()} />
        </Context.Link>
        <Context.Link onClick={() => router.navigate("/captions")}>
          <Context.LinkTitle>Caption settings</Context.LinkTitle>
          <Context.LinkChevron>English</Context.LinkChevron>
        </Context.Link>
        <Context.Link>
          <Context.LinkTitle>Playback settings</Context.LinkTitle>
          <Context.LinkChevron />
        </Context.Link>
      </Context.Section>
    </Context.Card>
  );
}
