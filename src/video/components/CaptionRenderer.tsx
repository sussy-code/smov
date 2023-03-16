import { Transition } from "@/components/Transition";
import { useSettings } from "@/state/settings";
import { parse, Cue } from "node-webvtt";
import { useRef } from "react";
import { useAsync } from "react-use";
import { useVideoPlayerDescriptor } from "../state/hooks";
import { useProgress } from "../state/logic/progress";
import { useSource } from "../state/logic/source";
import { Caption } from "./Caption";

export function CaptionRenderer({
  isControlsShown,
}: {
  isControlsShown: boolean;
}) {
  const descriptor = useVideoPlayerDescriptor();
  const source = useSource(descriptor).source;
  const videoTime = useProgress(descriptor).time;
  const { captionSettings } = useSettings();
  const captions = useRef<Cue[]>([]);

  useAsync(async () => {
    const url = source?.caption?.url;
    if (url) {
      // Is there a better way?
      const result = await fetch(url);
      // Uses UTF-8 by default
      const text = await result.text();
      captions.current = parse(text, { strict: false }).cues;
    } else {
      captions.current = [];
    }
  }, [source?.caption?.url]);

  if (!captions.current.length) return null;
  const isVisible = (start: number, end: number): boolean => {
    const delayedStart = start + captionSettings.delay;
    const delayedEnd = end + captionSettings.delay;
    return (
      Math.max(0, delayedStart) <= videoTime &&
      Math.max(0, delayedEnd) >= videoTime
    );
  };
  return (
    <Transition
      className={[
        "absolute flex w-full flex-col items-center transition-[bottom]",
        isControlsShown ? "bottom-24" : "bottom-12",
      ].join(" ")}
      animation="slide-up"
      show
    >
      <span>
        {captions.current.map(
          ({ identifier, end, start, text }) =>
            isVisible(start, end) && (
              <Caption key={identifier || `${start}-${end}`} text={text} />
            )
        )}
      </span>
    </Transition>
  );
}
