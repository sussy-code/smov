import { useEffect } from "react";
import { useVideoPlayerState } from "../VideoContext";

interface ShowControlProps {
  series?: {
    episode: number;
    season: number;
  };
  title?: string;
}

export function ShowControl(props: ShowControlProps) {
  const { videoState } = useVideoPlayerState();

  useEffect(() => {
    videoState.setShowData({
      current: props.series,
      isSeries: !!props.series,
      title: props.title,
    });
    // we only want it to run when props change, not when videoState changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return null;
}
