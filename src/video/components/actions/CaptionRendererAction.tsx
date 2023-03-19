import { Transition } from "@/components/Transition";
import { useSettings } from "@/state/settings";
import { sanitize } from "@/backend/helpers/captions";
import { parse, Cue } from "node-webvtt";
import { useRef } from "react";
import { useAsync } from "react-use";
import { useVideoPlayerDescriptor } from "../../state/hooks";
import { useProgress } from "../../state/logic/progress";
import { useSource } from "../../state/logic/source";

function CaptionCue({ text }: { text?: string }) {
  const { captionSettings } = useSettings();
  return (
    <span
      className="pointer-events-none mb-1 select-none whitespace-pre-line rounded px-4 py-1 text-center [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
      dir="auto"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: sanitize(text || "", {
          // https://www.w3.org/TR/webvtt1/#dom-construction-rules
          ALLOWED_TAGS: ["c", "b", "i", "u", "span", "ruby", "rt"],
          ADD_TAGS: ["v", "lang"],
          ALLOWED_ATTR: ["title", "lang"],
        }),
      }}
      style={{
        ...captionSettings.style,
      }}
    />
  );
}

export function CaptionRendererAction({
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
        "pointer-events-none absolute flex w-full flex-col items-center transition-[bottom]",
        isControlsShown ? "bottom-24" : "bottom-12",
      ].join(" ")}
      animation="slide-up"
      show
    >
      {captions.current.map(
        ({ identifier, end, start, text }) =>
          isVisible(start, end) && (
            <CaptionCue key={identifier || `${start}-${end}`} text={text} />
          )
      )}
    </Transition>
  );
}
