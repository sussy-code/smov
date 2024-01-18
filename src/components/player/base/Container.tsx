import { ReactNode, RefObject, useEffect, useRef } from "react";

import { OverlayDisplay } from "@/components/overlays/OverlayDisplay";
import { CastingInternal } from "@/components/player/internals/CastingInternal";
import { HeadUpdater } from "@/components/player/internals/HeadUpdater";
import { KeyboardEvents } from "@/components/player/internals/KeyboardEvents";
import { MetaReporter } from "@/components/player/internals/MetaReporter";
import { ProgressSaver } from "@/components/player/internals/ProgressSaver";
import { ThumbnailScraper } from "@/components/player/internals/ThumbnailScraper";
import { VideoClickTarget } from "@/components/player/internals/VideoClickTarget";
import { VideoContainer } from "@/components/player/internals/VideoContainer";
import { PlayerHoverState } from "@/stores/player/slices/interface";
import { usePlayerStore } from "@/stores/player/store";

export interface PlayerProps {
  children?: ReactNode;
  showingControls: boolean;
  onLoad?: () => void;
}

function useHovering(containerEl: RefObject<HTMLDivElement>) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateInterfaceHovering = usePlayerStore(
    (s) => s.updateInterfaceHovering,
  );
  const hovering = usePlayerStore((s) => s.interface.hovering);

  useEffect(() => {
    if (!containerEl.current) return;
    const el = containerEl.current;

    function pointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      updateInterfaceHovering(PlayerHoverState.MOUSE_HOVER);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateInterfaceHovering(PlayerHoverState.NOT_HOVERING);
        timeoutRef.current = null;
      }, 3000);
    }

    function pointerLeave(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      updateInterfaceHovering(PlayerHoverState.NOT_HOVERING);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    el.addEventListener("pointermove", pointerMove);
    el.addEventListener("pointerleave", pointerLeave);

    return () => {
      el.removeEventListener("pointermove", pointerMove);
      el.removeEventListener("pointerleave", pointerLeave);
    };
  }, [containerEl, hovering, updateInterfaceHovering]);
}

function BaseContainer(props: { children?: ReactNode }) {
  const containerEl = useRef<HTMLDivElement | null>(null);
  const display = usePlayerStore((s) => s.display);
  useHovering(containerEl);

  // report container element to display interface
  useEffect(() => {
    if (display && containerEl.current) {
      display.processContainerElement(containerEl.current);
    }
  }, [display, containerEl]);

  return (
    <div ref={containerEl}>
      <OverlayDisplay>
        <div className="h-screen select-none">{props.children}</div>
      </OverlayDisplay>
    </div>
  );
}

export function Container(props: PlayerProps) {
  const propRef = useRef(props.onLoad);
  useEffect(() => {
    propRef.current?.();
  }, []);

  return (
    <div className="relative">
      <BaseContainer>
        <MetaReporter />
        <ThumbnailScraper />
        <CastingInternal />
        <VideoContainer />
        <ProgressSaver />
        <KeyboardEvents />
        <div className="relative h-screen overflow-hidden">
          <VideoClickTarget showingControls={props.showingControls} />
          <HeadUpdater />
          {props.children}
        </div>
      </BaseContainer>
    </div>
  );
}
