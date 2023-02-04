import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Title } from "@/components/text/Title";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";
import { ReactNode } from "react";
import { VideoPlayerHeader } from "./VideoPlayerHeader";

interface VideoPlayerErrorProps {
  onGoBack?: () => void;
  children?: ReactNode;
}

export function VideoPlayerError(props: VideoPlayerErrorProps) {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  // TODO add error state

  const err = null as any;

  if (!err) return props.children as any;

  return (
    <div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-denim-100">
        <IconPatch icon={Icons.WARNING} className="mb-6 text-red-400" />
        <Title>Failed to load media</Title>
        <p className="my-6 max-w-lg">
          {err?.name}: {err?.description}
        </p>
      </div>
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col py-6 px-8 pb-2">
        <VideoPlayerHeader media={meta?.meta} onClick={props.onGoBack} />
      </div>
    </div>
  );
}
