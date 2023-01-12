// import { searchForMedia } from "@/backend/metadata/search";
// import { ProgressListenerControl } from "@/components/video/controls/ProgressListenerControl";
// import { SourceControl } from "@/components/video/controls/SourceControl";
// import { DecoratedVideoPlayer } from "@/components/video/DecoratedVideoPlayer";
import { useScrape } from "@/hooks/useScrape";
// import { MWMediaType } from "@/providers";
// import { useCallback, useState } from "react";

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
//  - features: HLS, error handling, preload interactions

// export function TestView() {
//   const [show, setShow] = useState(true);
//   const handleClick = useCallback(() => {
//     setShow((v) => !v);
//   }, [setShow]);

//   if (!show) {
//     return <p onClick={handleClick}>Click me to show</p>;
//   }

//   async function search() {
//     const test = await searchForMedia({
//       searchQuery: "tron",
//       type: MWMediaType.MOVIE,
//     });
//     console.log(test);
//   }

//   return (
//     <div className="w-[40rem] max-w-full">
//       <DecoratedVideoPlayer>
//         <SourceControl
//           source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
//           type="mp4"
//         />
//         <ProgressListenerControl
//           startAt={283}
//           onProgress={(a, b) => console.log(a, b)}
//         />
//       </DecoratedVideoPlayer>
//       <p onClick={() => search()}>click me to search</p>
//     </div>
//   );
// }

export function TestView() {
  const { eventLog, pending, stream } = useScrape();

  return (
    <div>
      <p>pending: {pending}</p>
      <p>
        stream: {stream?.streamUrl} - {stream?.type} - {stream?.quality}
      </p>
      <hr />
      {eventLog.map((v) => (
        <div className="rounded-xl p-1 text-white">
          <p>
            {v.percentage}% - {v.type} - {v.errored ? "ERROR" : "pending"}
          </p>
        </div>
      ))}
    </div>
  );
}
