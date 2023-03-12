import { mwFetch, proxiedFetch } from "@/backend/helpers/fetch";
import { MWCaption, MWCaptionType } from "@/backend/helpers/streams";
import toWebVTT from "srt-webvtt";

export const CUSTOM_CAPTION_ID = "customCaption";
export async function getCaptionUrl(caption: MWCaption): Promise<string> {
  if (caption.type === MWCaptionType.SRT) {
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

    return toWebVTT(captionBlob);
  }

  if (caption.type === MWCaptionType.VTT) {
    if (caption.needsProxy) {
      const blob = await proxiedFetch<Blob>(caption.url, {
        responseType: "blob" as any,
      });
      return URL.createObjectURL(blob);
    }

    return caption.url;
  }

  throw new Error("invalid type");
}

export async function convertCustomCaptionFileToWebVTT(file: File) {
  const header = await file.slice(0, 6).text();
  const isWebVTT = header === "WEBVTT";
  if (!isWebVTT) {
    return toWebVTT(file);
  }
  return URL.createObjectURL(file);
}

export function revokeCaptionBlob(url: string | undefined) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
