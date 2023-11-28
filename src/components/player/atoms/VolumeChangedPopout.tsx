import { Icon, Icons } from "@/components/Icon";
import { Flare } from "@/components/utils/Flare";
import { Transition } from "@/components/utils/Transition";
import { usePlayerStore } from "@/stores/player/store";
import { useEmpheralVolumeStore } from "@/stores/volume";

export function VolumeChangedPopout() {
  const empheralVolume = useEmpheralVolumeStore();

  const volume = usePlayerStore((s) => s.mediaPlaying.volume);

  return (
    <Transition
      animation="slide-down"
      show={empheralVolume.showVolume}
      className="absolute inset-x-0 top-4 flex justify-center pointer-events-none"
    >
      <Flare.Base className="hover:flare-enabled pointer-events-auto bg-video-context-background pl-4 pr-6 py-3 group w-72 h-full rounded-lg transition-colors text-video-context-type-main">
        <Flare.Light
          enabled
          flareSize={200}
          cssColorVar="--colors-video-context-light"
          backgroundClass="bg-video-context-background duration-100"
          className="rounded-lg"
        />
        <Flare.Child className="grid grid-cols-[auto,1fr] gap-3 pointer-events-auto relative transition-transform">
          <Icon
            className="text-2xl"
            icon={volume > 0 ? Icons.VOLUME : Icons.VOLUME_X}
          />
          <div className="w-full flex items-center">
            <div className="w-full h-1.5 rounded-full bg-video-context-slider bg-opacity-25">
              <div
                className="h-full bg-video-context-sliderFilled rounded-full transition-[width] duration-100"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </Flare.Child>
      </Flare.Base>
    </Transition>
  );
}
