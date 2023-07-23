import { useEffect } from "react";

import { getPlayerState } from "@/_oldvideo/state/cache";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { updateMisc } from "@/_oldvideo/state/logic/misc";

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
