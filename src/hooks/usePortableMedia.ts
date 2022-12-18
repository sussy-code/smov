import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MWPortableMedia } from "@/providers";

export function deserializePortableMedia(media: string): MWPortableMedia {
  return JSON.parse(atob(decodeURIComponent(media)));
}

export function serializePortableMedia(media: MWPortableMedia): string {
  const data = encodeURIComponent(btoa(JSON.stringify(media)));
  return data;
}

export function usePortableMedia(): MWPortableMedia | undefined {
  const { media } = useParams<{ media: string }>();
  const [mediaObject, setMediaObject] = useState<MWPortableMedia | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      setMediaObject(deserializePortableMedia(media));
    } catch (err) {
      console.error("Failed to deserialize portable media", err);
      setMediaObject(undefined);
    }
  }, [media, setMediaObject]);

  return mediaObject;
}
