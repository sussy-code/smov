import { useEffect } from "react";

import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import {
  VideoMediaPlayingEvent,
  useMediaPlaying,
} from "@/_oldvideo/state/logic/mediaplaying";
import { useMeta } from "@/_oldvideo/state/logic/meta";
import {
  VideoProgressEvent,
  useProgress,
} from "@/_oldvideo/state/logic/progress";
import { VideoPlayerMeta } from "@/_oldvideo/state/types";

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
