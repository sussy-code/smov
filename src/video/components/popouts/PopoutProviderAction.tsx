import { Transition } from "@/components/Transition";
import { useSyncPopouts } from "@/video/components/hooks/useSyncPopouts";
import { EpisodeSelectionPopout } from "@/video/components/popouts/EpisodeSelectionPopout";
import { SourceSelectionPopout } from "@/video/components/popouts/SourceSelectionPopout";
import { CaptionSelectionPopout } from "@/video/components/popouts/CaptionSelectionPopout";
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
  return (
    <div className="flex w-full items-center justify-center p-10">
      Unknown popout
    </div>
  );
}

function PopoutContainer(props: { videoInterface: VideoInterfaceEvent }) {
  const ref = useRef<HTMLDivElement>(null);
  const [right, setRight] = useState<number>(0);
  const [bottom, setBottom] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const { isMobile } = useIsMobile(true);

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
    <div
      ref={ref}
      className={[
        "absolute z-10 grid w-80 grid-rows-[auto,minmax(0,1fr)] overflow-hidden rounded-lg bg-ash-200",
        isMobile ? "h-[230px]" : " h-[500px]",
      ].join(" ")}
      style={{
        right: `${right}px`,
        bottom: `${bottom}px`,
      }}
    >
      <ShowPopout popoutId={props.videoInterface.popout} />
    </div>
  );
}

export function PopoutProviderAction() {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);
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
        <PopoutContainer videoInterface={videoInterface} />
      </div>
    </Transition>
  );
}
