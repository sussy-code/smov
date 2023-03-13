import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";
import { MWMediaType } from "@/backend/metadata/types";

export function DividerAction() {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);

  if (meta?.meta.meta.type !== MWMediaType.SERIES) return null;

  return <div className="mx-2 h-6 w-px bg-white opacity-50" />;
}
