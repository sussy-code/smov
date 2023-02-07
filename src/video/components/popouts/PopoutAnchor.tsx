import { getPlayerState } from "@/video/state/cache";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { updateInterface } from "@/video/state/logic/interface";
import { ReactNode, useEffect, useRef } from "react";

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

    let handle = -1;
    function render() {
      if (ref.current) {
        const current = JSON.stringify(state.interface.popoutBounds);
        const newer = ref.current.getBoundingClientRect();
        if (current !== JSON.stringify(newer)) {
          state.interface.popoutBounds = newer;
          updateInterface(descriptor, state);
        }
      }
      handle = window.requestAnimationFrame(render);
    }

    handle = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(handle);
    };
  }, [descriptor, props]);

  return <div ref={ref}>{props.children}</div>;
}
