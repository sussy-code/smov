import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";

export function Pip() {
  const display = usePlayerStore((s) => s.display);

  return (
    <VideoPlayerButton
      onClick={() => display?.togglePictureInPicture()}
      icon={Icons.PICTURE_IN_PICTURE}
    />
  );
}
