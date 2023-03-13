import { MWCaption } from "@/backend/helpers/streams";
import { DetailedMeta } from "@/backend/metadata/getmeta";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";
import { useEffect } from "react";

export type WindowMeta = {
  meta: DetailedMeta;
  captions: MWCaption[];
  episode?: {
    episodeId: string;
    seasonId: string;
  };
  seasons?: {
    id: string;
    number: number;
    title: string;
    episodes?: { id: string; number: number; title: string }[];
  }[];
} | null;

declare global {
  interface Window {
    meta?: Record<string, WindowMeta>;
  }
}

export function MetaAction() {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);

  useEffect(() => {
    if (!window.meta) window.meta = {};
    if (meta) {
      window.meta[descriptor] = {
        meta: meta.meta,
        captions: meta.captions,
        seasons: meta.seasons,
        episode: meta.episode,
      };
    }

    return () => {
      if (window.meta) delete window.meta[descriptor];
    };
  }, [meta, descriptor]);

  return null;
}
