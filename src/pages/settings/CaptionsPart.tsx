import classNames from "classnames";
import { useState } from "react";

import { Icon, Icons } from "@/components/Icon";
import {
  CaptionSetting,
  ColorOption,
  colors,
} from "@/components/player/atoms/settings/CaptionSettingsView";
import { Menu } from "@/components/player/internals/ContextMenu";
import { CaptionCue } from "@/components/player/Player";
import { Transition } from "@/components/Transition";
import { Heading1 } from "@/components/utils/Text";
import { SubtitleStyling, useSubtitleStore } from "@/stores/subtitles";

export function CaptionPreview(props: {
  fullscreen?: boolean;
  show?: boolean;
  styling: SubtitleStyling;
  onToggle: () => void;
}) {
  return (
    <div
      className={classNames({
        "pointer-events-none overflow-hidden w-full rounded": true,
        "aspect-video relative": !props.fullscreen,
        "fixed inset-0 z-50": props.fullscreen,
      })}
    >
      <Transition animation="fade" show={props.show}>
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{
            backgroundImage:
              "radial-gradient(102.95% 87.07% at 100% 100%, #EEAA45 0%, rgba(165, 186, 151, 0.56) 54.69%, rgba(74, 207, 254, 0.00) 100%), linear-gradient(180deg, #48D3FF 0%, #3B27B2 100%)",
          }}
        >
          <button
            type="button"
            className="tabbable bg-black absolute right-3 top-3 text-white bg-opacity-25 duration-100 transition-[background-color,transform] active:scale-110 hover:bg-opacity-50 p-2 rounded-md cursor-pointer"
            onClick={props.onToggle}
          >
            <Icon icon={props.fullscreen ? Icons.X : Icons.EXPAND} />
          </button>

          <div className="text-white pointer-events-none absolute flex w-full flex-col items-center transition-[bottom] bottom-0 p-4">
            <div
              className={
                props.fullscreen ? "" : "transform origin-bottom text-[0.5rem]"
              }
            >
              <CaptionCue
                text="I must not fear. Fear is the mind-killer."
                styling={props.styling}
                overrideCasing={false}
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export function CaptionsPart() {
  const styling = useSubtitleStore((s) => s.styling);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
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
        <CaptionPreview
          show
          styling={styling}
          onToggle={() => setFullscreenPreview((s) => !s)}
        />
        <CaptionPreview
          show={fullscreenPreview}
          fullscreen
          styling={styling}
          onToggle={() => setFullscreenPreview((s) => !s)}
        />
      </div>
    </div>
  );
}
