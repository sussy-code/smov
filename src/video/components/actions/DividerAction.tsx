import { MWMediaType } from "@/backend/metadata/types/mw";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";

export function DividerAction() {
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);

  if (meta?.meta.meta.type !== MWMediaType.SERIES) return null;

  return <div className="mx-2 h-6 w-px bg-white opacity-50" />;
}
