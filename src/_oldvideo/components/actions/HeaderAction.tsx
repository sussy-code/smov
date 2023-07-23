import { VideoPlayerHeader } from "@/_oldvideo/components/parts/VideoPlayerHeader";
import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useMeta } from "@/_oldvideo/state/logic/meta";

interface Props {
  onClick?: () => void;
  showControls?: boolean;
  isFullScreen: boolean;
}

export function HeaderAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);

  return <VideoPlayerHeader media={meta?.meta.meta} {...props} />;
}
