import classNames from "classnames";
import { ReactNode } from "react";

interface MobilePositionProps {
  children?: ReactNode;
  className?: string;
}

export function OverlayMobilePosition(props: MobilePositionProps) {
  return (
    <div
      className={classNames([
        "pointer-events-auto z-10 block origin-top-left touch-none overflow-hidden",
        props.className,
      ])}
    >
      {props.children}
    </div>
  );
}
