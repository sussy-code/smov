import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useMediaPlaying } from "@/_oldvideo/state/logic/mediaplaying";
import { useMisc } from "@/_oldvideo/state/logic/misc";
import { Spinner } from "@/components/layout/Spinner";

export function LoadingAction() {
  const descriptor = useVideoPlayerDescriptor();
  const mediaPlaying = useMediaPlaying(descriptor);
  const misc = useMisc(descriptor);

  const isLoading = mediaPlaying.isFirstLoading || mediaPlaying.isLoading;
  const shouldShow = !misc.isCasting;

  if (!isLoading || !shouldShow) return null;

  return <Spinner />;
}
