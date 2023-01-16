import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  startAt?: number;
  onProgress?: (time: number, duration: number) => void;
}

const FIVETEEN_MINUTES = 15 * 60;
const FIVE_MINUTES = 5 * 60;

function shouldRestoreTime(time: number, duration: number): boolean {
  const timeFromEnd = Math.max(0, duration - time);

  // short movie
  if (duration < FIVETEEN_MINUTES) {
    if (time < 5) return false;
    if (timeFromEnd < 60) return false;
    return true;
  }

  // long movie
  if (time < 30) return false;
  if (timeFromEnd < FIVE_MINUTES) return false;
  return true;
}

export function ProgressListenerControl(props: Props) {
  const { videoState } = useVideoPlayerState();
  const didInitialize = useRef<true | null>(null);

  // time updates (throttled)
  const updateTime = useMemo(
    () => throttle((a: number, b: number) => props.onProgress?.(a, b), 1000),
    [props]
  );
  useEffect(() => {
    if (!videoState.isPlaying) return;
    if (videoState.duration === 0 || videoState.time === 0) return;
    updateTime(videoState.time, videoState.duration);
  }, [videoState, updateTime]);
  useEffect(() => {
    return () => {
      updateTime.cancel();
    };
  }, [updateTime]);

  // initialize
  useEffect(() => {
    if (didInitialize.current) return;
    if (!videoState.hasInitialized || Number.isNaN(videoState.duration)) return;
    if (
      props.startAt !== undefined &&
      shouldRestoreTime(props.startAt, videoState.duration)
    ) {
      videoState.setTime(props.startAt);
    }
    didInitialize.current = true;
  }, [didInitialize, videoState, props]);

  return null;
}
