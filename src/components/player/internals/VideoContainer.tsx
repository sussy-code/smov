import { RefObject, useEffect, useRef } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { SourceSliceSource } from "@/stores/player/slices/source";
import { AllSlices } from "@/stores/player/slices/types";
import { usePlayerStore } from "@/stores/player/store";

// should this video container show right now?
function useShouldShow(source: SourceSliceSource | null): boolean {
  if (!source) return false;
  if (source.type !== MWStreamType.MP4) return false;
  return true;
}

// make video element up to par with the state
function useRestoreVideo(
  videoRef: RefObject<HTMLVideoElement>,
  player: AllSlices
) {
  useEffect(() => {
    const el = videoRef.current;
    const src = player.source?.url ?? "";
    if (!el) return;
    if (el.src !== src) el.src = src;
  }, [player.source?.url, videoRef]);
}

export function VideoContainer() {
  const videoEl = useRef<HTMLVideoElement>(null);
  const player = usePlayerStore();
  useRestoreVideo(videoEl, player);
  const show = useShouldShow(player.source);

  if (!show) return null;
  return <video autoPlay ref={videoEl} />;
}
