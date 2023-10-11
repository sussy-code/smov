import classNames from "classnames";
import { ReactNode } from "react";

interface AnchorPositionProps {
  children?: ReactNode;
  className?: string;
}

export function OverlayAnchorPosition(props: AnchorPositionProps) {
  return (
    <div
      style={{
        transform: `translateX(0px) translateY(0px)`,
      }}
      className={classNames([
        "pointer-events-auto z-10 inline-block origin-top-left touch-none",
        props.className,
      ])}
    >
      {props.children}
    </div>
  );
}
