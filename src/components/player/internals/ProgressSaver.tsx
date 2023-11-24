import { useEffect, useRef } from "react";
import { useInterval } from "react-use";

import { playerStatus } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";
import { ProgressItem, useProgressStore } from "@/stores/progress";

export function ProgressSaver() {
  const meta = usePlayerStore((s) => s.meta);
  const progress = usePlayerStore((s) => s.progress);
  const updateItem = useProgressStore((s) => s.updateItem);
  const status = usePlayerStore((s) => s.status);
  const hasPlayedOnce = usePlayerStore((s) => s.mediaPlaying.hasPlayedOnce);

  const lastSavedRef = useRef<ProgressItem | null>(null);

  const dataRef = useRef({
    updateItem,
    meta,
    progress,
    status,
    hasPlayedOnce,
  });
  useEffect(() => {
    dataRef.current.updateItem = updateItem;
    dataRef.current.meta = meta;
    dataRef.current.progress = progress;
    dataRef.current.status = status;
    dataRef.current.hasPlayedOnce = hasPlayedOnce;
  }, [updateItem, progress, meta, status, hasPlayedOnce]);

  useInterval(() => {
    const d = dataRef.current;
    if (!d.progress || !d.meta || !d.updateItem) return;
    if (d.status !== playerStatus.PLAYING) return;
    if (!hasPlayedOnce) return;

    let isDifferent = false;
    if (!lastSavedRef.current) isDifferent = true;
    else if (
      lastSavedRef.current?.duration !== progress.duration ||
      lastSavedRef.current?.watched !== progress.time
    )
      isDifferent = true;

    lastSavedRef.current = {
      duration: progress.duration,
      watched: progress.time,
    };
    if (isDifferent)
      d.updateItem({
        meta: d.meta,
        progress: lastSavedRef.current,
      });
  }, 3000);

  return null;
}
