import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Title } from "@/components/text/Title";
import { ReactNode } from "react";
import { useVideoPlayerState } from "../VideoContext";
import { VideoPlayerHeader } from "./VideoPlayerHeader";

interface VideoPlayerErrorProps {
  title?: string;
  onGoBack?: () => void;
  children?: ReactNode;
}

export function VideoPlayerError(props: VideoPlayerErrorProps) {
  const { videoState } = useVideoPlayerState();

  const err = videoState.error;

  if (!err) return props.children as any;

  return (
    <div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-denim-100">
        <IconPatch icon={Icons.WARNING} className="mb-6 text-red-400" />
        <Title>Failed to load media</Title>
        <p className="my-6 max-w-lg">
          {err.name}: {err.description}
        </p>
      </div>
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2">
        <VideoPlayerHeader title={props.title} onClick={props.onGoBack} />
      </div>
    </div>
  );
}
