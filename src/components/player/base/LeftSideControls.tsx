import classNames from "classnames";
import { useCallback, useEffect } from "react";

import { usePlayerStore } from "@/stores/player/store";

export function LeftSideControls(props: {
  children: React.ReactNode;
  className?: string;
}) {
  const setHoveringLeftControls = usePlayerStore(
    (s) => s.setHoveringLeftControls,
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
    <div
      className={classNames(["flex space-x-3 items-center", props.className])}
      onMouseLeave={mouseLeave}
    >
      {props.children}
    </div>
  );
}
