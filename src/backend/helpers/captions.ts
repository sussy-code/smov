import DOMPurify from "dompurify";
import { convert, detect, list, parse } from "subsrt-ts";
import { ContentCaption } from "subsrt-ts/dist/types/handler";

import { mwFetch, proxiedFetch } from "@/backend/helpers/fetch";
import { MWCaption, MWCaptionType } from "@/backend/helpers/streams";

export const customCaption = "external-custom";
export function makeCaptionId(caption: MWCaption, isLinked: boolean): string {
  return isLinked ? `linked-${caption.langIso}` : `external-${caption.langIso}`;
}
export const subtitleTypeList = list().map((type) => `.${type}`);
export function isSupportedSubtitle(url: string): boolean {
  return subtitleTypeList.some((type) => url.endsWith(type));
}

export function getMWCaptionTypeFromUrl(url: string): MWCaptionType {
  if (!isSupportedSubtitle(url)) return MWCaptionType.UNKNOWN;
  const type = subtitleTypeList.find((t) => url.endsWith(t));
  if (!type) return MWCaptionType.UNKNOWN;
  return type.slice(1) as MWCaptionType;
}

export const sanitize = DOMPurify.sanitize;
export async function getCaptionUrl(caption: MWCaption): Promise<string> {
  let captionBlob: Blob;
  if (caption.url.startsWith("blob:")) {
    // custom subtitle
    captionBlob = await (await fetch(caption.url)).blob();
  } else if (caption.needsProxy) {
    captionBlob = await proxiedFetch<Blob>(caption.url, {
      responseType: "blob" as any,
    });
  } else {
    captionBlob = await mwFetch<Blob>(caption.url, {
      responseType: "blob" as any,
    });
  }
  // convert to vtt for track element source which will be used in PiP mode
  const text = await captionBlob.text();
  const vtt = convert(text, "vtt");
  return URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
}

export function revokeCaptionBlob(url: string | undefined) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function parseSubtitles(text: string): ContentCaption[] {
  const textTrimmed = text.trim();
  if (textTrimmed === "") {
    throw new Error("Given text is empty");
  }
  if (detect(textTrimmed) === "") {
    throw new Error("Invalid subtitle format");
  }
  return parse(textTrimmed).filter(
    (cue) => cue.type === "caption"
  ) as ContentCaption[];
}
