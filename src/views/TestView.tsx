import { ProgressListenerControl } from "@/components/video/controls/ProgressListenerControl";
import { SourceControl } from "@/components/video/controls/SourceControl";
import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { useCallback, useState } from "react";

// test videos: https://gist.github.com/jsturgis/3b19447b304616f18657

// TODO video todos:
//  - error handling
//  - captions
//  - mobile UI
//  - safari fullscreen will make video overlap player controls
//  - safari progress bar is fucked (video doesnt change time but video.currentTime does change)

// TODO optional todos:
//  - shortcuts when player is active
//  - improve seekables (if possible)

// TODO stuff to test:
//  - browser: firefox, chrome, edge, safari desktop
//  - phones: android firefox, android chrome, iphone safari
//  - devices: ipadOS
//  - features: HLS, error handling

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
        <SourceControl
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
          type="mp4"
        />
        <ProgressListenerControl
          startAt={283}
          onProgress={(a, b) => console.log(a, b)}
        />
      </DecoratedVideoPlayer>
    </div>
  );
}
