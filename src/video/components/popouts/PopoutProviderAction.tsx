import { Transition } from "@/components/Transition";
import { useSyncPopouts } from "@/video/components/hooks/useSyncPopouts";
import { EpisodeSelectionPopout } from "@/video/components/popouts/EpisodeSelectionPopout";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./Popouts.css";

function ShowPopout(props: { popoutId: string | null }) {
  // only updates popout id when a new one is set, so transitions look good
  const [popoutId, setPopoutId] = useState<string | null>(props.popoutId);
  useEffect(() => {
    if (!props.popoutId) return;
    setPopoutId(props.popoutId);
  }, [props]);

  if (popoutId === "episodes") return <EpisodeSelectionPopout />;
  return null;
}

// TODO bug: first load ref is null
export function PopoutProviderAction() {
  const ref = useRef<HTMLDivElement>(null);
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);
  useSyncPopouts(descriptor);

  const handleClick = useCallback(() => {
    controls.closePopout();
  }, [controls]);

  const distanceFromRight = useMemo(() => {
    if (!videoInterface.popoutBounds) return 30;

    const buttonCenter =
      videoInterface.popoutBounds.left + videoInterface.popoutBounds.width / 2;

    return Math.max(
      window.innerWidth -
        buttonCenter -
        (ref.current?.getBoundingClientRect().width ?? 0) / 2,
      30
    );
  }, [videoInterface.popoutBounds]);

  const distanceFromBottom = useMemo(() => {
    return videoInterface.popoutBounds
      ? videoInterface.popoutBounds.height + 30
      : 30;
  }, [videoInterface.popoutBounds]);

  return (
    <Transition
      show={!!videoInterface.popout}
      animation="slide-up"
      className="h-full"
    >
      <div className="popout-wrapper pointer-events-auto absolute inset-0">
        <div onClick={handleClick} className="absolute inset-0" />
        <div
          ref={ref}
          className="absolute z-10 grid h-[500px] w-80 grid-rows-[auto,minmax(0,1fr)] overflow-hidden rounded-lg bg-ash-200"
          style={{
            right: `${distanceFromRight}px`,
            bottom: `${distanceFromBottom}px`,
          }}
        >
          <ShowPopout popoutId={videoInterface.popout} />
        </div>
      </div>
    </Transition>
  );
}
