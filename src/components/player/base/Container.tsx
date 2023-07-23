import { ReactNode } from "react";

export interface PlayerProps {
  children?: ReactNode;
}

export function Container(props: PlayerProps) {
  return <div>{props.children}</div>;
}
