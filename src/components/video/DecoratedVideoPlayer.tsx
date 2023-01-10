import { useCallback, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { BackdropControl } from "./controls/BackdropControl";
import { FullscreenControl } from "./controls/FullscreenControl";
import { LoadingControl } from "./controls/LoadingControl";
import { MiddlePauseControl } from "./controls/MiddlePauseControl";
import { PauseControl } from "./controls/PauseControl";
import { ProgressControl } from "./controls/ProgressControl";
import { TimeControl } from "./controls/TimeControl";
import { VolumeControl } from "./controls/VolumeControl";
import { VideoPlayerHeader } from "./parts/VideoPlayerHeader";
import { useVideoPlayerState } from "./VideoContext";
import { VideoPlayer, VideoPlayerProps } from "./VideoPlayer";

function LeftSideControls() {
  const { videoState } = useVideoPlayerState();

  const handleMouseEnter = useCallback(() => {
    videoState.setLeftControlsHover(true);
  }, [videoState]);
  const handleMouseLeave = useCallback(() => {
    videoState.setLeftControlsHover(false);
  }, [videoState]);

  return (
    <div
      className="flex items-center px-2"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <PauseControl />
      <VolumeControl className="mr-2" />
      <TimeControl />
    </div>
  );
}

export function DecoratedVideoPlayer(props: VideoPlayerProps) {
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const onBackdropChange = useCallback(
    (showing: boolean) => {
      setShow(showing);
    },
    [setShow]
  );

  return (
    <VideoPlayer autoPlay={props.autoPlay}>
      <BackdropControl onBackdropChange={onBackdropChange}>
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingControl />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <MiddlePauseControl />
        </div>
        <CSSTransition
          nodeRef={bottom}
          in={show}
          timeout={200}
          classNames={{
            exit: "transition-[transform,opacity] translate-y-0 duration-200 opacity-100",
            exitActive: "!translate-y-4 !opacity-0",
            exitDone: "hidden",
            enter:
              "transition-[transform,opacity] translate-y-4 duration-200 opacity-0",
            enterActive: "!translate-y-0 !opacity-100",
          }}
        >
          <div
            ref={bottom}
            className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col px-4 pb-2"
          >
            <ProgressControl />
            <div className="flex items-center">
              <LeftSideControls />
              <div className="flex-1" />
              <FullscreenControl />
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          nodeRef={top}
          in={show}
          timeout={200}
          classNames={{
            exit: "transition-[transform,opacity] translate-y-0 duration-200 opacity-100",
            exitActive: "!-translate-y-4 !opacity-0",
            exitDone: "hidden",
            enter:
              "transition-[transform,opacity] -translate-y-4 duration-200 opacity-0",
            enterActive: "!translate-y-0 !opacity-100",
          }}
        >
          <div
            ref={top}
            className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2"
          >
            <VideoPlayerHeader title="Spiderman: Coming House" />
          </div>
        </CSSTransition>
      </BackdropControl>
      {props.children}
    </VideoPlayer>
  );
}
