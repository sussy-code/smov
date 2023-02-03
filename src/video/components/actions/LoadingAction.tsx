import { Spinner } from "@/components/layout/Spinner";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

export function LoadingAction() {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);

  const isLoading = mediaPlaying.isFirstLoading || mediaPlaying.isLoading;

  if (!isLoading) return null;

  return <Spinner />;
}
