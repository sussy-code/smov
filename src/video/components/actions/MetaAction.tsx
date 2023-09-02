import { useEffect } from "react";

import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import {
  VideoMediaPlayingEvent,
  useMediaPlaying,
} from "@/video/state/logic/mediaplaying";
import { useMeta } from "@/video/state/logic/meta";
import { VideoProgressEvent, useProgress } from "@/video/state/logic/progress";
import { VideoPlayerMeta } from "@/video/state/types";

export type WindowMeta = {
  media: VideoPlayerMeta;
  state: {
    mediaPlaying: VideoMediaPlayingEvent;
    progress: VideoProgressEvent;
  };
};

declare global {
  interface Window {
    meta?: Record<string, WindowMeta>;
  }
}

export function MetaAction() {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const progress = useProgress(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);

  useEffect(() => {
    if (!window.meta) window.meta = {};
    if (meta) {
      window.meta[descriptor] = {
        media: meta,
        state: {
          mediaPlaying,
          progress,
        },
      };
    }

    return () => {
      if (window.meta) delete window.meta[descriptor];
    };
  }, [meta, descriptor, mediaPlaying, progress]);

  return null;
}
