import classNames from "classnames";
import { useMemo } from "react";

import {
  captionIsVisible,
  makeQueId,
  parseSubtitles,
  sanitize,
} from "@/components/player/utils/captions";
import { Transition } from "@/components/Transition";
import { usePlayerStore } from "@/stores/player/store";

export function CaptionCue({ text }: { text?: string }) {
  const textWithNewlines = (text || "").replaceAll(/\r?\n/g, "<br />");

  // https://www.w3.org/TR/webvtt1/#dom-construction-rules
  // added a <br /> for newlines
  const html = sanitize(textWithNewlines, {
    ALLOWED_TAGS: ["c", "b", "i", "u", "span", "ruby", "rt", "br"],
    ADD_TAGS: ["v", "lang"],
    ALLOWED_ATTR: ["title", "lang"],
  });

  return (
    <p className="pointer-events-none mb-1 select-none rounded px-4 py-1 text-center [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
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

export function SubtitleRenderer() {
  const videoTime = usePlayerStore((s) => s.progress.time);
  const srtData = usePlayerStore((s) => s.caption.selected?.srtData);

  const parsedCaptions = useMemo(
    () => (srtData ? parseSubtitles(srtData) : []),
    [srtData]
  );

  const visibileCaptions = useMemo(
    () =>
      parsedCaptions.filter(({ start, end }) =>
        captionIsVisible(start, end, 0, videoTime)
      ),
    [parsedCaptions, videoTime]
  );

  return (
    <div>
      {visibileCaptions.map(({ start, end, content }, i) => (
        <CaptionCue key={makeQueId(i, start, end)} text={content} />
      ))}
    </div>
  );
}

export function SubtitleView(props: { controlsShown: boolean }) {
  const caption = usePlayerStore((s) => s.caption.selected);
  const captionAsTrack = usePlayerStore((s) => s.caption.asTrack);

  if (captionAsTrack || !caption) return null;

  return (
    <Transition
      className="absolute inset-0 pointer-events-none"
      animation="slide-up"
      show
    >
      <div
        className={classNames([
          "text-white absolute flex w-full flex-col items-center transition-[bottom]",
          props.controlsShown ? "bottom-24" : "bottom-12",
        ])}
      >
        <SubtitleRenderer />
      </div>
    </Transition>
  );
}
