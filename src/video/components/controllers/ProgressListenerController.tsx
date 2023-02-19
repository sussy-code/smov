import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash.throttle";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { useProgress } from "@/video/state/logic/progress";
import { useControls } from "@/video/state/logic/controls";
import { useMisc } from "@/video/state/logic/misc";

interface Props {
  startAt?: number;
  onProgress?: (time: number, duration: number) => void;
}

export function ProgressListenerController(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);
  const progress = useProgress(descriptor);
  const controls = useControls(descriptor);
  const misc = useMisc(descriptor);
  const didInitialize = useRef<true | null>(null);
  const lastTime = useRef<number>(props.startAt ?? 0);

  // time updates (throttled)
  const updateTime = useMemo(
    () =>
      throttle((a: number, b: number) => {
        lastTime.current = a;
        props.onProgress?.(a, b);
      }, 1000),
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
    controls.setTime(lastTime.current);
    didInitialize.current = true;
  }, [didInitialize, props, progress, mediaPlaying, controls]);

  // when switching state providers
  // TODO stateProviderId is somehow ALWAYS "video"
  const lastStateProviderId = useRef<string | null>(null);
  const stateProviderId = useMemo(() => misc.stateProviderId, [misc]);
  useEffect(() => {
    if (lastStateProviderId.current === stateProviderId) return;
    if (mediaPlaying.isFirstLoading) return;
    lastStateProviderId.current = stateProviderId;
    controls.setTime(lastTime.current);
  }, [controls, mediaPlaying, stateProviderId]);

  useEffect(() => {
    // if it initialized, but media starts loading for the first time again.
    // reset initalized so it will restore time again
    if (didInitialize.current && mediaPlaying.isFirstLoading)
      didInitialize.current = null;
  }, [mediaPlaying]);

  return null;
}
