import { ReactNode } from "react";

interface Props {
  id: string;
  children?: ReactNode;
}

export function OverlayAnchor(props: Props) {
  return <div id={`__overlayRouter::${props.id}`}>{props.children}</div>;
}
