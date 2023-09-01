import { useEffect } from "react";

import { MWStreamType } from "@/backend/helpers/streams";
import { usePlayer } from "@/components/player/hooks/usePlayer";
import { PlayerView } from "@/pages/PlayerView";

export default function VideoTesterView() {
  const player = usePlayer();

  useEffect(() => {
    player.playMedia({
      type: MWStreamType.MP4,
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    });
  });

  return <PlayerView />;
}
