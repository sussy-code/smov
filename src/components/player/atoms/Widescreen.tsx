import { useState } from "react";

import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";

export function Widescreen() {
  // Add widescreen status
  const [isWideScreen, setIsWideScreen] = useState(false);

  return (
    <VideoPlayerButton
      icon={isWideScreen ? Icons.SHRINK : Icons.STRETCH}
      className="text-white"
      onClick={() => {
        const videoElement = document.getElementById("video-element");
        if (videoElement) {
          videoElement.classList.toggle("object-cover");
          setIsWideScreen(!isWideScreen);
        }
      }}
    />
  );
}
