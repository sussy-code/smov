import { useEffect } from "react";

import { MWCaption } from "@/backend/helpers/streams";
import { MWSeasonWithEpisodeMeta } from "@/backend/metadata/types/mw";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useControls } from "@/video/state/logic/controls";
import { VideoPlayerMeta } from "@/video/state/types";

interface MetaControllerProps {
  data?: VideoPlayerMeta;
  seasonData?: MWSeasonWithEpisodeMeta;
  linkedCaptions?: MWCaption[];
}

function formatMetadata(
  props: MetaControllerProps
): VideoPlayerMeta | undefined {
  const seasonsWithEpisodes = props.data?.seasons?.map((v) => {
    if (v.id === props.seasonData?.id)
      return {
        ...v,
        episodes: props.seasonData.episodes,
      };
    return v;
  });

  if (!props.data) return undefined;

  return {
    meta: props.data.meta,
    episode: props.data.episode,
    seasons: seasonsWithEpisodes,
    captions: props.linkedCaptions ?? [],
  };
}

export function MetaController(props: MetaControllerProps) {
  const descriptor = useVideoPlayerDescriptor();
  const controls = useControls(descriptor);

  useEffect(() => {
    controls.setMeta(formatMetadata(props));
  }, [props, controls]);

  return null;
}
