import { mwFetch, proxiedFetch } from "@/backend/helpers/fetch";
import { MWCaption } from "@/backend/helpers/streams";
import DOMPurify from "dompurify";
import { parse, detect, list } from "subsrt-ts";
import { ContentCaption } from "subsrt-ts/dist/types/handler";

export const customCaption = "external-custom";
export function makeCaptionId(caption: MWCaption, isLinked: boolean): string {
  return isLinked ? `linked-${caption.langIso}` : `external-${caption.langIso}`;
}
export const subtitleTypeList = list().map((type) => `.${type}`);
export const sanitize = DOMPurify.sanitize;
export async function getCaptionUrl(caption: MWCaption): Promise<string> {
  if (caption.url.startsWith("blob:")) return caption.url;
  let captionBlob: Blob;
  if (caption.needsProxy) {
    captionBlob = await proxiedFetch<Blob>(caption.url, {
      responseType: "blob" as any,
    });
  } else {
    captionBlob = await mwFetch<Blob>(caption.url, {
      responseType: "blob" as any,
    });
  }
  return URL.createObjectURL(captionBlob);
}

export function revokeCaptionBlob(url: string | undefined) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function parseSubtitles(text: string): ContentCaption[] {
  if (detect(text) === "") {
    throw new Error("Invalid subtitle format");
  }
  return parse(text).filter(
    (cue) => cue.type === "caption"
  ) as ContentCaption[];
}
