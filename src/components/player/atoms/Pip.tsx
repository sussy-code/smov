import { Icons } from "@/components/Icon";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { usePlayerStore } from "@/stores/player/store";
import {
  canPictureInPicture,
  canWebkitPictureInPicture,
} from "@/utils/detectFeatures";

export function Pip() {
  const display = usePlayerStore((s) => s.display);

  if (!canPictureInPicture() && !canWebkitPictureInPicture()) return null;

  return (
    <VideoPlayerButton
      onClick={() => display?.togglePictureInPicture()}
      icon={Icons.PICTURE_IN_PICTURE}
    />
  );
}
