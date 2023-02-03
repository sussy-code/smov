// import {
//   useChromecast,
//   useChromecastAvailable,
// } from "@/hooks/useChromecastAvailable";
// import { useEffect, useRef } from "react";

import { PauseAction } from "@/video/components/actions/PauseAction";
import { VideoPlayerBase } from "@/video/components/VideoPlayerBase";

// function ChromeCastButton() {
//   const ref = useRef<HTMLDivElement>(null);
//   const available = useChromecastAvailable();

//   useEffect(() => {
//     if (!available) return;
//     const tag = document.createElement("google-cast-launcher");
//     tag.setAttribute("id", "castbutton");
//     ref.current?.appendChild(tag);
//   }, [available]);

//   return <div ref={ref} />;
// }

export function TestView() {
  return (
    <VideoPlayerBase>
      <PauseAction />
    </VideoPlayerBase>
  );
}
