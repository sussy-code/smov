import classNames from "classnames";
import { useMemo } from "react";

import {
  captionIsVisible,
  makeQueId,
  parseSubtitles,
  sanitize,
} from "@/components/player/utils/captions";
import { Transition } from "@/components/utils/Transition";
import { usePlayerStore } from "@/stores/player/store";
import { SubtitleStyling, useSubtitleStore } from "@/stores/subtitles";

const wordOverrides: Record<string, string> = {
  i: "I",
};

export function CaptionCue({
  text,
  styling,
  overrideCasing,
}: {
  text?: string;
  styling: SubtitleStyling;
  overrideCasing: boolean;
}) {
  const parsedHtml = useMemo(() => {
    let textToUse = text;
    if (overrideCasing && text) {
      textToUse = text.slice(0, 1) + text.slice(1).toLowerCase();
    }

    const textWithNewlines = (textToUse || "")
      .split(" ")
      .map((word) => wordOverrides[word] ?? word)
      .join(" ")
      .replaceAll(/ i'/g, " I'")
      .replaceAll(/\r?\n/g, "<br />");

    // https://www.w3.org/TR/webvtt1/#dom-construction-rules
    // added a <br /> for newlines
    const html = sanitize(textWithNewlines, {
      ALLOWED_TAGS: ["c", "b", "i", "u", "span", "ruby", "rt", "br"],
      ADD_TAGS: ["v", "lang"],
      ALLOWED_ATTR: ["title", "lang"],
    });

    return html;
  }, [text, overrideCasing]);

  return (
    <p
      className="pointer-events-none mb-1 select-none rounded px-4 py-1 text-center leading-normal [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]"
      style={{
        color: styling.color,
        fontSize: `${(1.5 * styling.size).toFixed(2)}em`,
        backgroundColor: `rgba(0,0,0,${styling.backgroundOpacity.toFixed(2)})`,
        backdropFilter:
          styling.backgroundBlur !== 0
            ? `blur(${Math.floor(styling.backgroundBlur * 64)}px)`
            : "none",
        fontWeight: styling.bold ? "bold" : "normal",
      }}
    >
      <span
        // its sanitised a few lines up
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: parsedHtml,
        }}
        dir="ltr"
      />
    </p>
  );
}

export function SubtitleRenderer() {
  const videoTime = usePlayerStore((s) => s.progress.time);
  const srtData = usePlayerStore((s) => s.caption.selected?.srtData);
  const language = usePlayerStore((s) => s.caption.selected?.language);
  const styling = useSubtitleStore((s) => s.styling);
  const overrideCasing = useSubtitleStore((s) => s.overrideCasing);
  const delay = useSubtitleStore((s) => s.delay);

  const parsedCaptions = useMemo(
    () => (srtData ? parseSubtitles(srtData, language) : []),
    [srtData, language],
  );

  const visibileCaptions = useMemo(
    () =>
      parsedCaptions.filter(({ start, end }) =>
        captionIsVisible(start, end, delay, videoTime),
      ),
    [parsedCaptions, videoTime, delay],
  );

  return (
    <div>
      {visibileCaptions.map(({ start, end, content }, i) => (
        <CaptionCue
          key={makeQueId(i, start, end)}
          text={content}
          styling={styling}
          overrideCasing={overrideCasing}
        />
      ))}
    </div>
  );
}

export function SubtitleView(props: { controlsShown: boolean }) {
  const caption = usePlayerStore((s) => s.caption.selected);
  const captionAsTrack = usePlayerStore((s) => s.caption.asTrack);
  const display = usePlayerStore((s) => s.display);
  const isCasting = display?.getType() === "casting";

  if (captionAsTrack || !caption || isCasting) return null;

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
