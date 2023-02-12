import { Icons } from "@/components/Icon";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function ChromecastAction(props: Props) {
  return (
    <VideoPlayerIconButton className={props.className} icon={Icons.CASTING} />
  );
}
