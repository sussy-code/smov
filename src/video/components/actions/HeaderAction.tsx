import { VideoPlayerHeader } from "@/video/components/parts/VideoPlayerHeader";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";

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
