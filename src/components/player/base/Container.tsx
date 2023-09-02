import { ReactNode } from "react";

import { VideoContainer } from "@/components/player/internals/VideoContainer";

export interface PlayerProps {
  children?: ReactNode;
}

export function Container(props: PlayerProps) {
  return (
    <div>
      <VideoContainer />
      {props.children}
    </div>
  );
}
