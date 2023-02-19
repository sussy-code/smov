import { Spinner } from "@/components/layout/Spinner";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";
import { useMisc } from "@/video/state/logic/misc";

export function LoadingAction() {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);
  const misc = useMisc(descriptor);

  const isLoading = mediaPlaying.isFirstLoading || mediaPlaying.isLoading;
  const shouldShow = !misc.isCasting;

  if (!isLoading || !shouldShow) return null;

  return <Spinner />;
}
