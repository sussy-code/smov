import { Icon, Icons } from "@/components/Icon";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useInterface } from "@/video/state/logic/interface";
import { useMediaPlaying } from "@/video/state/logic/mediaplaying";

export function VolumeAdjustedAction() {
  const descriptor = useVideoPlayerDescriptor();
  const videoInterface = useInterface(descriptor);
  const mediaPlaying = useMediaPlaying(descriptor);

  return (
    <div
      className={[
        videoInterface.volumeChangedWithKeybind
          ? "mt-10 scale-100 opacity-100"
          : "mt-5 scale-75 opacity-0",
        "absolute left-1/2 z-[100] flex -translate-x-1/2 items-center space-x-4 rounded-full bg-bink-300 bg-opacity-50 px-5 py-2 transition-all duration-100",
      ].join(" ")}
    >
      <Icon
        icon={mediaPlaying.volume > 0 ? Icons.VOLUME : Icons.VOLUME_X}
        className="text-xl text-white"
      />
      <div className="h-2 w-44 overflow-hidden rounded-full bg-denim-100">
        <div
          className="h-full rounded-r-full bg-bink-500 transition-[width] duration-100"
          style={{ width: `${mediaPlaying.volume * 100}%` }}
        />
      </div>
    </div>
  );
}
