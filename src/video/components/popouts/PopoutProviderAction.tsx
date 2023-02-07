import { Transition } from "@/components/Transition";
import { EpisodeSelectionPopout } from "@/video/components/popouts/EpisodeSelectionPopout";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";
import { useCallback, useEffect, useMemo, useState } from "react";

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

// TODO use new design for popouts
// TODO improve anti offscreen math
// TODO attach router history to popout state, so you can use back button to remove popout
export function PopoutProviderAction() {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);

  const handleClick = useCallback(() => {
    controls.closePopout();
  }, [controls]);

  const distanceFromRight = useMemo(() => {
    return videoInterface.popoutBounds
      ? `${Math.max(
          window.innerWidth -
            videoInterface.popoutBounds.right -
            videoInterface.popoutBounds.width / 2,
          30
        )}px`
      : "30px";
  }, [videoInterface]);
  const distanceFromBottom = useMemo(() => {
    return videoInterface.popoutBounds
      ? `${Math.max(
          videoInterface.popoutBounds.bottom -
            videoInterface.popoutBounds.top +
            videoInterface.popoutBounds.height
        )}px`
      : "30px";
  }, [videoInterface]);

  return (
    <Transition show={!!videoInterface.popout} animation="fade">
      <div className="popout-wrapper pointer-events-auto absolute inset-0">
        <div onClick={handleClick} className="absolute inset-0" />
        <div
          className="grid-template-rows-[auto,minmax(0px,1fr)] absolute z-10 grid h-[500px] w-72 rounded-lg bg-denim-300"
          style={{
            right: distanceFromRight,
            bottom: distanceFromBottom,
          }}
        >
          <ShowPopout popoutId={videoInterface.popout} />
        </div>
      </div>
    </Transition>
  );
}
