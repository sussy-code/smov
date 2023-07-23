import { ReactNode } from "react";

import { useVideoPlayerDescriptor } from "@/_oldvideo/state/hooks";
import { useError } from "@/_oldvideo/state/logic/error";
import { useMeta } from "@/_oldvideo/state/logic/meta";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icons } from "@/components/Icon";
import { Title } from "@/components/text/Title";

import { VideoPlayerHeader } from "./VideoPlayerHeader";

interface VideoPlayerErrorProps {
  onGoBack?: () => void;
  children?: ReactNode;
}

export function VideoPlayerError(props: VideoPlayerErrorProps) {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const errorData = useError(descriptor);

  const err = errorData.error;

  if (!err) return props.children as any;

  return (
    <div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-denim-100">
        <IconPatch icon={Icons.WARNING} className="mb-6 text-red-400" />
        <Title>Failed to load media</Title>
        <p className="my-6 max-w-lg text-center">
          {err?.name}: {err?.description}
        </p>
      </div>
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col px-8 py-6 pb-2">
        <VideoPlayerHeader media={meta?.meta.meta} onClick={props.onGoBack} />
      </div>
    </div>
  );
}
