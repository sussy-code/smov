import { ReactNode, useEffect, useRef } from "react";

import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { updateInterface } from "@/video/state/logic/interface";

interface Props {
  for: string;
  children?: ReactNode;
}

export function PopoutAnchor(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const descriptor = useVideoPlayerDescriptor();

  useEffect(() => {
    if (!ref.current) return;
    const state = getPlayerState(descriptor);

    if (state.interface.popout !== props.for) return;

    let cancelled = false;
    function render() {
      if (cancelled) return;

      if (ref.current) {
        const current = JSON.stringify(state.interface.popoutBounds);
        const newer = ref.current.getBoundingClientRect();
        if (current !== JSON.stringify(newer)) {
          state.interface.popoutBounds = newer;
          updateInterface(descriptor, state);
        }
      }
      window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
    return () => {
      cancelled = true;
    };
  }, [descriptor, props]);

  return <div ref={ref}>{props.children}</div>;
}
