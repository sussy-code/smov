import {
  CaptionSetting,
  ColorOption,
  colors,
} from "@/components/player/atoms/settings/CaptionSettingsView";
import { Menu } from "@/components/player/internals/ContextMenu";
import { CaptionCue } from "@/components/player/Player";
import { Heading1 } from "@/components/utils/Text";
import { useSubtitleStore } from "@/stores/subtitles";

export function CaptionsPart() {
  const styling = useSubtitleStore((s) => s.styling);
  const isFullscreenPreview = false;
  const updateStyling = useSubtitleStore((s) => s.updateStyling);

  return (
    <div>
      <Heading1 border>Captions</Heading1>
      <div className="grid grid-cols-[1fr,356px] gap-8">
        <div className="space-y-6">
          <CaptionSetting
            label="Background opacity"
            max={100}
            min={0}
            onChange={(v) => updateStyling({ backgroundOpacity: v / 100 })}
            value={styling.backgroundOpacity * 100}
            textTransformer={(s) => `${s}%`}
          />
          <CaptionSetting
            label="Text size"
            max={200}
            min={1}
            textTransformer={(s) => `${s}%`}
            onChange={(v) => updateStyling({ size: v / 100 })}
            value={styling.size * 100}
          />
          <div className="flex justify-between items-center">
            <Menu.FieldTitle>Color</Menu.FieldTitle>
            <div className="flex justify-center items-center">
              {colors.map((v) => (
                <ColorOption
                  onClick={() => updateStyling({ color: v })}
                  color={v}
                  active={styling.color === v}
                  key={v}
                />
              ))}
            </div>
          </div>
        </div>
        <div
          className="w-full aspect-video rounded relative overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(102.95% 87.07% at 100% 100%, #EEAA45 0%, rgba(165, 186, 151, 0.56) 54.69%, rgba(74, 207, 254, 0.00) 100%), linear-gradient(180deg, #48D3FF 0%, #3B27B2 100%)",
          }}
        >
          <div className="text-white pointer-events-none absolute flex w-full flex-col items-center transition-[bottom] bottom-0 p-4">
            <div
              className={
                isFullscreenPreview
                  ? ""
                  : "transform origin-bottom text-[0.5rem]"
              }
            >
              <CaptionCue
                // Can we keep this Dune quote 🥺
                text="I must not fear. Fear is the mind-killer."
                styling={styling}
                overrideCasing={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
