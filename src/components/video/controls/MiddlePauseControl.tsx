import { Icon, Icons } from "@/components/Icon";
import { useCallback } from "react";
import { useVideoPlayerState } from "../VideoContext";

export function MiddlePauseControl() {
  const { videoState } = useVideoPlayerState();

  const handleClick = useCallback(() => {
    if (videoState?.isPlaying) videoState.pause();
    else videoState.play();
  }, [videoState]);

  if (videoState.hasPlayedOnce) return null;
  if (videoState.isPlaying) return null;

  return (
    <div
      onClick={handleClick}
      className="group pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-denim-400 text-white transition-[background-color,transform] hover:scale-125 hover:bg-denim-500 active:scale-100"
    >
      <Icon
        icon={Icons.PLAY}
        className="text-2xl transition-transform group-hover:scale-125"
      />
    </div>
  );
}
