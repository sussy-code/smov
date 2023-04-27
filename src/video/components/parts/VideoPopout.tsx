import { useEffect, useRef } from "react";

import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { useInterface } from "@/video/state/logic/interface";

interface Props {
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

export function VideoPopout(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const controls = useControls(descriptor);

  const popoutRef = useRef<HTMLDivElement>(null);
  const isOpen = videoInterface.popout === props.id;

  useEffect(() => {
    if (!isOpen) return;
    const popoutEl = popoutRef.current;
    function windowClick(e: MouseEvent) {
      const rect = popoutEl?.getBoundingClientRect();
      if (rect) {
        if (
          e.pageX >= rect.x &&
          e.pageX <= rect.x + rect.width &&
          e.pageY >= rect.y &&
          e.pageY <= rect.y + rect.height
        ) {
          // inside bounding box of popout
          return;
        }
      }

      controls.closePopout();
    }

    window.addEventListener("click", windowClick);
    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, [isOpen, controls]);

  return (
    <div
      className={[
        "is-popout absolute inset-x-0 h-0",
        !isOpen ? "hidden" : "",
      ].join(" ")}
    >
      <div className="absolute bottom-10 right-0 h-96 w-72 rounded-lg bg-denim-400">
        <div
          ref={popoutRef}
          className={["h-full w-full", props.className].join(" ")}
        >
          {isOpen ? props.children : null}
        </div>
      </div>
    </div>
  );
}
