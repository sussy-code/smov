import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  startAt?: number;
  onProgress?: (time: number, duration: number) => void;
}

// TODO fix infinite loops
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
    if (props.startAt !== undefined) {
      videoState.setTime(props.startAt);
    }
    didInitialize.current = true;
  }, [didInitialize, props, videoState]);

  return null;
}
