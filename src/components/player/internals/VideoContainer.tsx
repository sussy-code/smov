import { useEffect, useRef } from "react";

import { usePlayerStore } from "@/stores/player/store";

export function VideoContainer() {
  const player = usePlayerStore();
  const videoEl = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoEl.current) videoEl.current.src = player.source?.url ?? "";
  }, [player.source?.url]);

  return <video controls ref={videoEl} />;
}
