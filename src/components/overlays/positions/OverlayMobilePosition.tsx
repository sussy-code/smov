import classNames from "classnames";
import { ReactNode } from "react";

import { useInternalOverlayRouter } from "@/hooks/useOverlayRouter";

interface MobilePositionProps {
  children?: ReactNode;
  className?: string;
}

export function OverlayMobilePosition(props: MobilePositionProps) {
  const router = useInternalOverlayRouter("hello world :)");

  return (
    <div
      className={classNames([
        "pointer-events-auto px-4 pb-6 z-10 bottom-0 block origin-top-left inset-x-0 absolute overflow-hidden",
        props.className,
      ])}
    >
      {props.children}

      {/* Close button */}
      <button
        className="w-full text-video-context-type-main bg-video-context-background z-10 relative hover:bg-video-context-border active:scale-95 rounded-2xl pointer-events-auto transition-all duration-100 flex justify-center items-center py-3 mt-3 font-bold border border-video-context-border hover:text-white"
        type="button"
        onClick={() => router.close()}
      >
        Close
      </button>
      {/* Gradient to hide the progress */}
      <div className="pointer-events-none absolute z-0 bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
