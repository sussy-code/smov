// import {
//   useChromecast,
//   useChromecastAvailable,
// } from "@/hooks/useChromecastAvailable";
// import { useEffect, useRef } from "react";

import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { LoadingAction } from "@/video/components/actions/LoadingAction";
import { MiddlePauseAction } from "@/video/components/actions/MiddlePauseAction";
import { PauseAction } from "@/video/components/actions/PauseAction";
import { ProgressAction } from "@/video/components/actions/ProgressAction";
import { SkipTimeAction } from "@/video/components/actions/SkipTimeAction";
import { TimeAction } from "@/video/components/actions/TimeAction";
import { SourceController } from "@/video/components/controllers/SourceController";
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
      <SourceController
        quality={MWStreamQuality.QUNKNOWN}
        source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        type={MWStreamType.MP4}
      />
      <MiddlePauseAction />
      <ProgressAction />
      <LoadingAction />
      <TimeAction />
      <SkipTimeAction />
    </VideoPlayerBase>
  );
}
