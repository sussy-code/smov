import { FloatingCardView } from "@/components/popout/FloatingCard";
import { FloatingDragHandle } from "@/components/popout/FloatingDragHandle";
import { FloatingView } from "@/components/popout/FloatingView";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { DownloadAction } from "@/video/components/actions/list-entries/DownloadAction";
import { CaptionsSelectionAction } from "@/video/components/actions/list-entries/CaptionsSelectionAction";
import { SourceSelectionAction } from "@/video/components/actions/list-entries/SourceSelectionAction";
import { PlaybackSpeedSelectionAction } from "@/video/components/actions/list-entries/PlaybackSpeedSelectionAction";
import { CaptionSelectionPopout } from "./CaptionSelectionPopout";
import { SourceSelectionPopout } from "./SourceSelectionPopout";
import { CaptionSettingsPopout } from "./CaptionSettingsPopout";
import { PlaybackSpeedPopout } from "./PlaybackSpeedPopout";

export function SettingsPopout() {
  const floatingRouter = useFloatingRouter();
  const { pageProps, navigate } = floatingRouter;

  return (
    <>
      <FloatingView {...pageProps("/")} width={320}>
        <FloatingDragHandle />
        <FloatingCardView.Content>
          <DownloadAction />
          <SourceSelectionAction onClick={() => navigate("/source")} />
          <CaptionsSelectionAction onClick={() => navigate("/captions")} />
          <PlaybackSpeedSelectionAction
            onClick={() => navigate("/playback-speed")}
          />
        </FloatingCardView.Content>
      </FloatingView>
      <SourceSelectionPopout router={floatingRouter} prefix="source" />
      <CaptionSelectionPopout router={floatingRouter} prefix="captions" />
      <CaptionSettingsPopout
        router={floatingRouter}
        prefix="caption-settings"
      />
      <PlaybackSpeedPopout router={floatingRouter} prefix="playback-speed" />
    </>
  );
}
