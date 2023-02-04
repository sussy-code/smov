// import {
//   useChromecast,
//   useChromecastAvailable,
// } from "@/hooks/useChromecastAvailable";
// import { useEffect, useRef } from "react";

import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
// import { MWMediaType } from "@/backend/metadata/types";
// import { MetaController } from "@/video/components/controllers/MetaController";
import { SourceController } from "@/video/components/controllers/SourceController";
import { VideoPlayer } from "@/video/components/VideoPlayer";

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
    <VideoPlayer onGoBack={() => alert("hello world")}>
      <SourceController
        quality={MWStreamQuality.QUNKNOWN}
        source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        type={MWStreamType.MP4}
      />
      {/* <MetaController
        meta={{
          id: "test",
          title: "Hello world",
          type: MWMediaType.MOVIE,
          year: "1234",
          seasons: undefined,
        }} */}
      {/* /> */}
    </VideoPlayer>
  );
}
