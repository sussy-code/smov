import { useCallback } from "react";

import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";

export function SkipForward() {
  const display = usePlayerStore((s) => s.display);
  const time = usePlayerStore((s) => s.progress.time);

  const commit = useCallback(() => {
    display?.setTime(time + 10);
  }, [display, time]);

  return <VideoPlayerButton onClick={commit} icon={Icons.SKIP_FORWARD} />;
}

export function SkipBackward() {
  const display = usePlayerStore((s) => s.display);
  const time = usePlayerStore((s) => s.progress.time);

  const commit = useCallback(() => {
    display?.setTime(time - 10);
  }, [display, time]);

  return <VideoPlayerButton onClick={commit} icon={Icons.SKIP_BACKWARD} />;
}
