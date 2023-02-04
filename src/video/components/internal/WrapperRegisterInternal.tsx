import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useEffect } from "react";

export function WrapperRegisterInternal(props: {
  wrapper: HTMLDivElement | null;
}) {
  const descriptor = useVideoPlayerDescriptor();

  useEffect(() => {
    const state = getPlayerState(descriptor);
    state.wrapperElement = props.wrapper;
  }, [props.wrapper, descriptor]);

  return null;
}
