import { useMemo } from "react";

import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { qualityToString } from "@/stores/player/utils/qualities";
import { useSubtitleStore } from "@/stores/subtitles";
import { providers } from "@/utils/providers";

export function SettingsMenu({ id }: { id: string }) {
  const router = useOverlayRouter(id);
  const currentQuality = usePlayerStore((s) => s.currentQuality);
  const lastSelectedLanguage = useSubtitleStore((s) => s.lastSelectedLanguage);
  const selectedCaptionLanguage = usePlayerStore(
    (s) => s.caption.selected?.language
  );
  const subtitlesEnabled = useSubtitleStore((s) => s.enabled);
  const setSubtitleLanguage = useSubtitleStore((s) => s.setLanguage);
  const currentSourceId = usePlayerStore((s) => s.sourceId);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const sourceName = useMemo(() => {
    if (!currentSourceId) return "...";
    return providers.getMetadata(currentSourceId)?.name ?? "...";
  }, [currentSourceId]);

  // TODO actually scrape subtitles to load
  function toggleSubtitles() {
    if (!subtitlesEnabled) setSubtitleLanguage(lastSelectedLanguage ?? "en");
    else {
      setSubtitleLanguage(null);
      setCaption(null);
    }
  }

  return (
    <Menu.Card>
      <Menu.SectionTitle>Video settings</Menu.SectionTitle>
      <Menu.Section>
        <Menu.ChevronLink
          onClick={() => router.navigate("/quality")}
          rightText={currentQuality ? qualityToString(currentQuality) : ""}
        >
          Quality
        </Menu.ChevronLink>
        <Menu.ChevronLink
          onClick={() => router.navigate("/source")}
          rightText={sourceName}
        >
          Video source
        </Menu.ChevronLink>
        <Menu.Link
          clickable
          rightSide={<Icon className="text-xl" icon={Icons.DOWNLOAD} />}
        >
          Download
        </Menu.Link>
      </Menu.Section>

      <Menu.SectionTitle>Viewing Experience</Menu.SectionTitle>
      <Menu.Section>
        <Menu.Link
          rightSide={
            <Toggle
              enabled={subtitlesEnabled}
              onClick={() => toggleSubtitles()}
            />
          }
        >
          Enable Captions
        </Menu.Link>
        <Menu.ChevronLink
          onClick={() => router.navigate("/captions")}
          rightText={selectedCaptionLanguage}
        >
          Caption settings
        </Menu.ChevronLink>
        <Menu.ChevronLink onClick={() => router.navigate("/playback")}>
          Playback settings
        </Menu.ChevronLink>
      </Menu.Section>
    </Menu.Card>
  );
}
