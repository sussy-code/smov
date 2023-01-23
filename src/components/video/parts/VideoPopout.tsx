import { useEffect, useRef } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface Props {
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

// TODO store popout in router history so you can press back to yeet
export function VideoPopout(props: Props) {
  const { videoState } = useVideoPlayerState();
  const popoutRef = useRef<HTMLDivElement>(null);
  const isOpen = videoState.popout === props.id;

  useEffect(() => {
    if (!isOpen) return;
    const popoutEl = popoutRef.current;
    let hasTriggered = false;
    function windowClick() {
      setTimeout(() => {
        if (hasTriggered) return;
        videoState.closePopout();
        hasTriggered = false;
      }, 10);
    }
    function popoutClick() {
      hasTriggered = true;
      setTimeout(() => {
        hasTriggered = false;
      }, 100);
    }
    window.addEventListener("click", windowClick);
    popoutEl?.addEventListener("click", popoutClick);
    return () => {
      window.removeEventListener("click", windowClick);
      popoutEl?.removeEventListener("click", popoutClick);
    };
  }, [isOpen, videoState]);

  if (!isOpen) return null;

  return (
    <div className="is-popout absolute inset-x-0 h-0">
      <div className="absolute bottom-10 right-0 h-96 w-72 rounded-lg bg-denim-400">
        <div
          ref={popoutRef}
          className={["h-full w-full", props.className].join(" ")}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
