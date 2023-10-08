import { useCallback, useEffect } from "react";

import { usePlayerStore } from "@/stores/player/store";

export function LeftSideControls(props: { children: React.ReactNode }) {
  const setHoveringLeftControls = usePlayerStore(
    (s) => s.setHoveringLeftControls
  );

  const mouseLeave = useCallback(() => {
    setHoveringLeftControls(false);
  }, [setHoveringLeftControls]);

  useEffect(() => {
    return () => {
      setHoveringLeftControls(false);
    };
  }, [setHoveringLeftControls]);

  return (
    <div className="flex space-x-3 items-center" onMouseLeave={mouseLeave}>
      {props.children}
    </div>
  );
}
