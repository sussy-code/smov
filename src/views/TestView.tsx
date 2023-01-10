import { SourceControl } from "@/components/video/controls/SourceControl";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { useCallback, useState } from "react";

// test videos: https://gist.github.com/jsturgis/3b19447b304616f18657

// TODO video todos:
//  - improve seekables (if possible)
//  - error handling
//  - middle pause button
//  - double click backdrop to toggle fullscreen
//  - make volume bar collapse when hovering away from left control section
//  - animate UI when showing/hiding
//  - shortcuts when player is active
//  - save volume in localstorage so persists between page reloads
//  - improve pausing while seeking/buffering
//  - volume control flashes old value when updating
//  - progress control flashes old value when updating
//  - captions
//  - IOS & IpadOS support: (no volume)
//  - HLS support: feature detection otherwise use HLS.js
export function TestView() {
  const [show, setShow] = useState(true);
  const handleClick = useCallback(() => {
    setShow((v) => !v);
  }, [setShow]);

  if (!show) {
    return <p onClick={handleClick}>Click me to show</p>;
  }

  return (
    <div className="w-[40rem] max-w-full">
      <DecoratedVideoPlayer>
        <SourceControl source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" />
      </DecoratedVideoPlayer>
    </div>
  );
}
