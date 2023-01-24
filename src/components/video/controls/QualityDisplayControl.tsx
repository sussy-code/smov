import { useContext } from "react";
import { VideoPlayerContext } from "../VideoContext";

export function QualityDisplayControl() {
  const videoPlayerContext = useContext(VideoPlayerContext);

  return (
    <div className="rounded-md bg-denim-300 py-1 px-2 transition-colors">
      <p className="text-center text-xs font-bold text-slate-300 transition-colors">
        {videoPlayerContext.quality}
      </p>
    </div>
  );
}
