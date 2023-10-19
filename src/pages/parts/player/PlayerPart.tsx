import { ReactNode } from "react";

import { BrandPill } from "@/components/layout/BrandPill";
import { Player } from "@/components/player";
import { useShouldShowControls } from "@/components/player/hooks/useShouldShowControls";
import { PlayerMeta, playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

export interface PlayerPartProps {
  children?: ReactNode;
  backUrl: string;
  onLoad?: () => void;
  onMetaChange?: (meta: PlayerMeta) => void;
}

export function PlayerPart(props: PlayerPartProps) {
  const { showTargets, showTouchTargets } = useShouldShowControls();
  const status = usePlayerStore((s) => s.status);

  return (
    <Player.Container onLoad={props.onLoad}>
      {props.children}
      <Player.BlackOverlay show={showTargets} />
      <Player.SubtitleView controlsShown={showTargets} />

      {status === playerStatus.PLAYING ? (
        <Player.CenterControls>
          <Player.LoadingSpinner />
          <Player.AutoPlayStart />
        </Player.CenterControls>
      ) : null}

      <Player.CenterMobileControls
        className="text-white"
        show={showTouchTargets}
      >
        <Player.SkipBackward iconSizeClass="text-3xl" />
        <Player.Pause iconSizeClass="text-5xl" />
        <Player.SkipForward iconSizeClass="text-3xl" />
      </Player.CenterMobileControls>

      <Player.TopControls show={showTargets}>
        <div className="grid grid-cols-[1fr,auto] xl:grid-cols-3 items-center">
          <div className="flex space-x-3 items-center">
            <Player.BackLink url={props.backUrl} />
            <span className="text mx-3 text-type-secondary">/</span>
            <Player.Title />
            <Player.BookmarkButton />
          </div>
          <div className="text-center hidden xl:flex justify-center items-center">
            <Player.EpisodeTitle />
          </div>
          <div className="hidden sm:flex items-center justify-end">
            <BrandPill />
          </div>
        </div>
      </Player.TopControls>

      <Player.BottomControls show={showTargets}>
        <Player.ProgressBar />
        <div className="flex justify-between">
          <Player.LeftSideControls className="hidden lg:flex">
            <Player.Pause />
            <Player.SkipBackward />
            <Player.SkipForward />
            <Player.Volume />
            <Player.Time />
          </Player.LeftSideControls>
          <Player.LeftSideControls className="flex lg:hidden">
            {/* Do mobile controls here :) */}
            <Player.Time />
          </Player.LeftSideControls>
          <div className="flex items-center space-x-3">
            <Player.Episodes onChange={props.onMetaChange} />
            <Player.Airplay />
            <Player.Settings />
            <Player.Fullscreen />
          </div>
        </div>
      </Player.BottomControls>

      <Player.VolumeChangedPopout />
    </Player.Container>
  );
}
