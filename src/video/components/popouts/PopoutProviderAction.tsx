import { useDrag } from "@use-gesture/react";
import { a, useSpring, config, easings } from "@react-spring/web";
import { Transition } from "@/components/Transition";
import { useSyncPopouts } from "@/video/components/hooks/useSyncPopouts";
import { EpisodeSelectionPopout } from "@/video/components/popouts/EpisodeSelectionPopout";
import { SourceSelectionPopout } from "@/video/components/popouts/SourceSelectionPopout";
import { CaptionSelectionPopout } from "@/video/components/popouts/CaptionSelectionPopout";
import { SettingsPopout } from "@/video/components/popouts/SettingsPopout";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  useInterface,
  VideoInterfaceEvent,
} from "@/video/state/logic/interface";
import { useCallback, useEffect, useRef, useState } from "react";

import "./Popouts.css";

function ShowPopout(props: { popoutId: string | null }) {
  // only updates popout id when a new one is set, so transitions look good
  const [popoutId, setPopoutId] = useState<string | null>(props.popoutId);
  useEffect(() => {
    if (!props.popoutId) return;
    setPopoutId(props.popoutId);
  }, [props]);

  if (popoutId === "episodes") return <EpisodeSelectionPopout />;
  if (popoutId === "source") return <SourceSelectionPopout />;
  if (popoutId === "captions") return <CaptionSelectionPopout />;
  if (popoutId === "settings") return <SettingsPopout />;
  return (
    <div className="flex w-full items-center justify-center p-10">
      Unknown popout
    </div>
  );
}

function MobilePopoutContainer(props: {
  videoInterface: VideoInterfaceEvent;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const height = 500;
  const closing = useRef<boolean>(false);
  const [{ y }, api] = useSpring(() => ({
    y: 0,
    onRest() {
      if (!closing.current) return;
      props.onClose();
    },
  }));

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my] }) => {
      if (closing.current) return;
      if (last) {
        if (my > height * 0.5 || (vy > 0.5 && dy > 0)) {
          api.start({
            y: height * 1.2,
            immediate: false,
            config: { ...config.wobbly, velocity: vy, clamp: true },
          });
          closing.current = true;
        } else {
          api.start({
            y: 0,
            immediate: false,
            config: config.wobbly,
          });
        }
      } else {
        api.start({ y: my, immediate: true });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  return (
    <a.div
      ref={ref}
      className="absolute inset-x-0 -bottom-[200px] z-10 mx-auto grid h-[700px] max-w-[400px] touch-none grid-rows-[auto,minmax(0,1fr)] overflow-hidden rounded-t-lg bg-ash-200"
      style={{
        y,
      }}
      {...bind()}
    >
      <div className="mx-auto mt-3 -mb-3 h-1 w-12 rounded-full bg-ash-500 bg-opacity-30" />
      <ShowPopout popoutId={props.videoInterface.popout} />
    </a.div>
  );
}

function DesktopPopoutContainer(props: {
  videoInterface: VideoInterfaceEvent;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [right, setRight] = useState<number>(0);
  const [bottom, setBottom] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const calculateAndSetCoords = useCallback((rect: DOMRect, w: number) => {
    const buttonCenter = rect.left + rect.width / 2;

    setBottom(rect ? rect.height + 30 : 30);
    setRight(Math.max(window.innerWidth - buttonCenter - w / 2, 30));
  }, []);

  useEffect(() => {
    if (!props.videoInterface.popoutBounds) return;
    calculateAndSetCoords(props.videoInterface.popoutBounds, width);
  }, [props.videoInterface.popoutBounds, calculateAndSetCoords, width]);

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    setWidth(rect?.width ?? 0);
  }, []);

  return (
    <a.div
      ref={ref}
      className="absolute z-10 grid h-[500px] w-80 touch-none grid-rows-[auto,minmax(0,1fr)] overflow-hidden rounded-lg bg-ash-200"
      style={{
        right: `${right}px`,
        bottom: `${bottom}px`,
      }}
    >
      <ShowPopout popoutId={props.videoInterface.popout} />
    </a.div>
  );
}

export function PopoutProviderAction() {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);
  const { isMobile } = useIsMobile(false);
  useSyncPopouts(descriptor);

  const handleClick = useCallback(() => {
    controls.closePopout();
  }, [controls]);

  return (
    <Transition
      show={!!videoInterface.popout}
      animation="slide-up"
      className="h-full"
    >
      <div className="popout-wrapper pointer-events-auto absolute inset-0">
        <div onClick={handleClick} className="absolute inset-0" />
        {isMobile ? (
          <MobilePopoutContainer
            videoInterface={videoInterface}
            onClose={handleClick}
          />
        ) : (
          <DesktopPopoutContainer videoInterface={videoInterface} />
        )}
      </div>
    </Transition>
  );
}
