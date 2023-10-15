import { useEffect, useRef } from "react";
import { useInterval } from "react-use";

import { usePlayerStore } from "@/stores/player/store";
import { useProgressStore } from "@/stores/progress";

export function ProgressSaver() {
  const meta = usePlayerStore((s) => s.meta);
  const progress = usePlayerStore((s) => s.progress);
  const updateItem = useProgressStore((s) => s.updateItem);

  const updateItemRef = useRef(updateItem);
  useEffect(() => {
    updateItemRef.current = updateItem;
  }, [updateItem]);

  const metaRef = useRef(meta);
  useEffect(() => {
    metaRef.current = meta;
  }, [meta]);

  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useInterval(() => {
    if (updateItemRef.current && metaRef.current && progressRef.current)
      updateItemRef.current({
        meta: metaRef.current,
        progress: {
          duration: progress.duration,
          watched: progress.time,
        },
      });
  }, 3000);

  return null;
}
