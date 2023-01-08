import { SourceControl } from "@/components/video/controls/SourceControl";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { useCallback, useState } from "react";

// test videos: https://gist.github.com/jsturgis/3b19447b304616f18657

// TODO video todos:
//  - make pretty
//  - improve seekables
//  - error handling
//  - middle pause button
//  - improve pausing while seeking/buffering
//  - captions
//  - backdrop better click handling
//  - IOS support: (no volume, fullscreen video element instead of wrapper)
//  - IpadOS support: (fullscreen video wrapper should work, see (lookmovie.io) )
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
