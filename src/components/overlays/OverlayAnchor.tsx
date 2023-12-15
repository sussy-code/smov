import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  id: string;
  children?: ReactNode;
  className?: string;
}

export function OverlayAnchor(props: Props) {
  return (
    <div className={classNames("relative", props.className)}>
      <div
        id={`__overlayRouter::${props.id}`}
        className="absolute inset-0 -z-10"
      />
      {props.children}
    </div>
  );
}
