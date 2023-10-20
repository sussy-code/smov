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
        "pointer-events-auto z-10 bottom-0 block origin-top-left inset-x-0 absolute overflow-hidden",
        props.className,
      ])}
    >
      {props.children}
    </div>
  );
}
