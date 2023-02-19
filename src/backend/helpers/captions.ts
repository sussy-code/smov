import { mwFetch, proxiedFetch } from "@/backend/helpers/fetch";
import { MWCaption, MWCaptionType } from "@/backend/helpers/streams";
import toWebVTT from "srt-webvtt";

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
