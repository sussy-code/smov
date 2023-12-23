import classNames from "classnames";
import { PointerEvent, useCallback } from "react";

import { useShouldShowVideoElement } from "@/components/player/internals/VideoContainer";
import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export function VideoClickTarget(props: { showingControls: boolean }) {
  const show = useShouldShowVideoElement();
  const display = usePlayerStore((s) => s.display);
  const isPaused = usePlayerStore((s) => s.mediaPlaying.isPaused);
  const updateInterfaceHovering = usePlayerStore(
    (s) => s.updateInterfaceHovering,
  );
  const hovering = usePlayerStore((s) => s.interface.hovering);

  const toggleFullscreen = useCallback(() => {
    display?.toggleFullscreen();
  }, [display]);

  const togglePause = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      // pause on mouse click
      if (e.pointerType === "mouse") {
        if (e.button !== 0) return;
        if (isPaused) display?.play();
        else display?.pause();
        return;
      }

      // toggle on other types of clicks
      if (hovering !== PlayerHoverState.MOBILE_TAPPED)
        updateInterfaceHovering(PlayerHoverState.MOBILE_TAPPED);
      else updateInterfaceHovering(PlayerHoverState.NOT_HOVERING);
    },
    [display, isPaused, hovering, updateInterfaceHovering],
  );

  if (!show) return null;

  return (
    <div
      className={classNames("absolute inset-0", {
        "absolute inset-0": true,
        "cursor-none": !props.showingControls,
      })}
      onDoubleClick={toggleFullscreen}
      onPointerUp={togglePause}
    />
  );
}
