import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { useProgress } from "@/video/state/logic/progress";
import { useControls } from "@/video/state/logic/controls";

interface Props {
  startAt?: number;
  onProgress?: (time: number, duration: number) => void;
}

export function ProgressListenerController(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);
  const progress = useProgress(descriptor);
  const controls = useControls(descriptor);
  const didInitialize = useRef<true | null>(null);

  // time updates (throttled)
  const updateTime = useMemo(
    () => throttle((a: number, b: number) => props.onProgress?.(a, b), 1000),
    [props]
  );
  useEffect(() => {
    if (!mediaPlaying.isPlaying) return;
    if (progress.duration === 0 || progress.time === 0) return;
    updateTime(progress.time, progress.duration);
  }, [progress, mediaPlaying, updateTime]);
  useEffect(() => {
    return () => {
      updateTime.cancel();
    };
  }, [updateTime]);

  // initialize
  useEffect(() => {
    if (didInitialize.current) return;
    if (mediaPlaying.isFirstLoading || Number.isNaN(progress.duration)) return;
    if (props.startAt !== undefined) {
      controls.setTime(props.startAt);
    }
    didInitialize.current = true;
  }, [didInitialize, props, progress, mediaPlaying, controls]);

  return null;
}
