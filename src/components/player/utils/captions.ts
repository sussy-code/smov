import { RunOutput } from "@movie-web/providers";
import DOMPurify from "dompurify";
import { convert, detect, parse } from "subsrt-ts";
import { ContentCaption } from "subsrt-ts/dist/types/handler";

import { CaptionListItem } from "@/stores/player/slices/source";

export type CaptionCueType = ContentCaption;
export const sanitize = DOMPurify.sanitize;

export function captionIsVisible(
  start: number,
  end: number,
  delay: number,
  currentTime: number,
) {
  const delayedStart = start / 1000 + delay;
  const delayedEnd = end / 1000 + delay;
  return (
    Math.max(0, delayedStart) <= currentTime &&
    Math.max(0, delayedEnd) >= currentTime
  );
}

export function makeQueId(index: number, start: number, end: number): string {
  return `${index}-${start}-${end}`;
}

export function convertSubtitlesToVtt(text: string): string {
  const textTrimmed = text.trim();
  if (textTrimmed === "") {
    throw new Error("Given text is empty");
  }
  const vtt = convert(textTrimmed, "vtt");
  if (detect(vtt) === "") {
    throw new Error("Invalid subtitle format");
  }
  return vtt;
}

export function convertSubtitlesToSrt(text: string): string {
  const textTrimmed = text.trim();
  if (textTrimmed === "") {
    throw new Error("Given text is empty");
  }
  const srt = convert(textTrimmed, "srt");
  if (detect(srt) === "") {
    throw new Error("Invalid subtitle format");
  }
  return srt;
}

export function filterDuplicateCaptionCues(cues: ContentCaption[]) {
  return cues.reduce((acc: ContentCaption[], cap: ContentCaption) => {
    const lastCap = acc[acc.length - 1];
    const isSameAsLast =
      lastCap?.start === cap.start &&
      lastCap?.end === cap.end &&
      lastCap?.content === cap.content;
    if (lastCap === undefined || !isSameAsLast) {
      acc.push(cap);
    }
    return acc;
  }, []);
}

export function parseVttSubtitles(vtt: string) {
  return parse(vtt).filter((cue) => cue.type === "caption") as CaptionCueType[];
}

export function parseSubtitles(
  text: string,
  _language?: string,
): CaptionCueType[] {
  const vtt = convertSubtitlesToVtt(text);
  return parseVttSubtitles(vtt);
}

function stringToBase64(input: string): string {
  return btoa(String.fromCodePoint(...new TextEncoder().encode(input)));
}

export function convertSubtitlesToSrtDataurl(text: string): string {
  return `data:application/x-subrip;base64,${stringToBase64(
    convertSubtitlesToSrt(text),
  )}`;
}

export function convertSubtitlesToObjectUrl(text: string): string {
  return URL.createObjectURL(
    new Blob([convertSubtitlesToVtt(text)], {
      type: "text/vtt",
    }),
  );
}

export function convertProviderCaption(
  captions: RunOutput["stream"]["captions"],
): CaptionListItem[] {
  return captions.map((v) => ({
    id: v.id,
    language: v.language,
    url: v.url,
    needsProxy: v.hasCorsRestrictions,
  }));
}
