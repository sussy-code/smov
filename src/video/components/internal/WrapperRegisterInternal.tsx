import { useEffect } from "react";

import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { updateMisc } from "@/video/state/logic/misc";

export function WrapperRegisterInternal(props: {
  wrapper: HTMLDivElement | null;
}) {
  const descriptor = useVideoPlayerDescriptor();

  useEffect(() => {
    const state = getPlayerState(descriptor);
    state.wrapperElement = props.wrapper;
    updateMisc(descriptor, state);
  }, [props.wrapper, descriptor]);

  return null;
}
