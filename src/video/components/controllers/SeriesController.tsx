import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";

interface SeriesControllerProps {
  onSelect?: (state: { episodeId?: string; seasonId?: string }) => void;
}

export function SeriesController(props: SeriesControllerProps) {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const history = useHistory();

  const lastState = useRef<{
    episodeId?: string;
    seasonId?: string;
  } | null>(null);

  useEffect(() => {
    const currentState = {
      episodeId: meta?.episode?.episodeId,
      seasonId: meta?.episode?.seasonId,
    };
    if (lastState.current === null) {
      if (!meta) return;
      lastState.current = currentState;
      return;
    }

    // when changes are detected, trigger event handler
    if (
      currentState.episodeId !== lastState.current?.episodeId ||
      currentState.seasonId !== lastState.current?.seasonId
    ) {
      lastState.current = currentState;
      props.onSelect?.(currentState);
    }
  }, [meta, props, history]);

  return null;
}
