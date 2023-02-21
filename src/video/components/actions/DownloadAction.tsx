import { Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useSource } from "@/video/state/logic/source";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function DownloadAction(props: Props) {
  const descriptor = useVideoPlayerDescriptor();
  const sourceInterface = useSource(descriptor);

  return (
    <a href={sourceInterface.source?.url} download>
      <VideoPlayerIconButton
        className={props.className}
        icon={Icons.DOWNLOAD}
      />
    </a>
  );
}
