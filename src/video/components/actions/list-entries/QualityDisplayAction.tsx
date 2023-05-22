import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useSource } from "@/video/state/logic/source";

export function QualityDisplayAction() {
  const descriptor = useVideoPlayerDescriptor();
  const source = useSource(descriptor);

  if (!source.source) return null;

  return (
    <div className="rounded-md bg-denim-300 px-2 py-1 transition-colors">
      <p className="text-center text-xs font-bold text-slate-300 transition-colors">
        {source.source.quality}
      </p>
    </div>
  );
}
