import { MWMediaMeta } from "@/backend/metadata/types";
import { useWatchedContext, getWatchedFromPortable } from "@/state/watched";
import { Episode } from "./EpisodeButton";

export interface WatchedEpisodeProps {
  media: MWMediaMeta;
  onClick?: () => void;
  active?: boolean;
}

export function WatchedEpisode(props: WatchedEpisodeProps) {
  // const { watched } = useWatchedContext();
  // const foundWatched = getWatchedFromPortable(watched.items, props.media);
  // // const episode = getEpisodeFromMedia(props.media);
  // const watchedPercentage = (foundWatched && foundWatched.percentage) || 0;
  // return (
  //   <Episode
  //     progress={watchedPercentage}
  //     episodeNumber={episode?.episode?.sort ?? 1}
  //     active={props.active}
  //     onClick={props.onClick}
  //   />
  // );
}
