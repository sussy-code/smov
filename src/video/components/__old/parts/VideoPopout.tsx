import { useEffect, useRef } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

// TODO store popout in router history so you can press back to yeet
// TODO add transition
export function VideoPopout(props: Props) {
  const { videoState } = useVideoPlayerState();
  const popoutRef = useRef<HTMLDivElement>(null);
  const isOpen = videoState.popout === props.id;

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

      videoState.closePopout();
    }

    window.addEventListener("click", windowClick);
    return () => {
      window.removeEventListener("click", windowClick);
    };
  }, [isOpen, videoState]);

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
