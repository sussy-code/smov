import { Transition } from "@/components/Transition";
import { useSettings } from "@/state/settings";
import { sanitize, parseSubtitles } from "@/backend/helpers/captions";
import { ContentCaption } from "subsrt-ts/dist/types/handler";
import { useRef } from "react";
import { useAsync } from "react-use";
import { useVideoPlayerDescriptor } from "../../state/hooks";
import { useProgress } from "../../state/logic/progress";
import { useSource } from "../../state/logic/source";

export function CaptionCue({ text, scale }: { text?: string; scale?: number }) {
  const { captionSettings } = useSettings();
  const textWithNewlines = (text || "").replaceAll(/\r?\n/g, "<br />");

  // https://www.w3.org/TR/webvtt1/#dom-construction-rules
  // added a <br /> for newlines
  const html = sanitize(textWithNewlines, {
    ALLOWED_TAGS: ["c", "b", "i", "u", "span", "ruby", "rt", "br"],
    ADD_TAGS: ["v", "lang"],
    ALLOWED_ATTR: ["title", "lang"],
  });

  return (
    <p
      className="pointer-events-none mb-1 select-none rounded px-4 py-1 text-center [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
      style={{
        ...captionSettings.style,
        fontSize: captionSettings.style.fontSize * (scale ?? 1),
      }}
    >
      <span
        // its sanitised a few lines up
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: html,
        }}
        dir="auto"
      />
    </p>
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
  const captions = useRef<ContentCaption[]>([]);

  useAsync(async () => {
    const blobUrl = source?.caption?.url;
    if (blobUrl) {
      const result = await fetch(blobUrl);
      const text = await result.text();
      try {
        captions.current = parseSubtitles(text);
      } catch (error) {
        captions.current = [];
      }
    } else {
      captions.current = [];
    }
  }, [source?.caption?.url]);

  if (!captions.current.length) return null;
  const isVisible = (start: number, end: number): boolean => {
    const delayedStart = start / 1000 + captionSettings.delay;
    const delayedEnd = end / 1000 + captionSettings.delay;
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
        ({ start, end, content }) =>
          isVisible(start, end) && (
            <CaptionCue key={`${start}-${end}`} text={content} />
          )
      )}
    </Transition>
  );
}
