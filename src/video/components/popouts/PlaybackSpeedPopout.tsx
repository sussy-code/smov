import { useTranslation } from "react-i18next";

import { Icon, Icons } from "@/components/Icon";
import { FloatingCardView } from "@/components/popout/FloatingCard";
import { FloatingView } from "@/components/popout/FloatingView";
import { Slider } from "@/components/Slider";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

import { PopoutListEntry, PopoutSection } from "./PopoutUtils";

const speedSelectionOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export function PlaybackSpeedPopout(props: {
  router: ReturnType<typeof useFloatingRouter>;
  prefix: string;
}) {
  const { t } = useTranslation();

  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);

  return (
    <FloatingView
      {...props.router.pageProps(props.prefix)}
      width={320}
      height={500}
    >
      <FloatingCardView.Header
        title={t("videoPlayer.popouts.playbackSpeed")}
        description={t("videoPlayer.popouts.descriptions.playbackSpeed")}
        goBack={() => props.router.navigate("/")}
      />
      <FloatingCardView.Content noSection>
        <PopoutSection>
          {speedSelectionOptions.map((speed) => (
            <PopoutListEntry
              key={speed}
              active={mediaPlaying.playbackSpeed === speed}
              onClick={() => {
                controls.setPlaybackSpeed(speed);
                controls.closePopout();
              }}
            >
              {speed}x
            </PopoutListEntry>
          ))}
        </PopoutSection>

        <p className="sticky top-0 z-10 flex items-center space-x-1 bg-ash-300 px-5 py-3 text-xs font-bold uppercase">
          <Icon className="text-base" icon={Icons.TACHOMETER} />
          <span>{t("videoPlayer.popouts.customPlaybackSpeed")}</span>
        </p>

        <PopoutSection className="pt-0">
          <div>
            <Slider
              min={0.1}
              max={10}
              step={0.1}
              value={mediaPlaying.playbackSpeed}
              valueDisplay={`${mediaPlaying.playbackSpeed}x`}
              onChange={(e: { target: { valueAsNumber: number } }) =>
                controls.setPlaybackSpeed(e.target.valueAsNumber)
              }
            />
          </div>
        </PopoutSection>
      </FloatingCardView.Content>
    </FloatingView>
  );
}
