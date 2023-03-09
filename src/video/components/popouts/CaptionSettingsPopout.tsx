import { Dropdown, OptionItem } from "@/components/Dropdown";
import { useSettings } from "@/state/settings";
// import { useTranslation } from "react-i18next";
import { PopoutSection } from "./PopoutUtils";

export function CaptionSettingsPopout() {
  // For now, won't add label texts to language files since options are prone to change
  // const { t } = useTranslation();
  const {
    captionSettings,
    setCaptionBackgroundColor,
    setCaptionColor,
    setCaptionDelay,
    setCaptionFontSize,
    setCaptionFontFamily,
    setCaptionTextShadow,
  } = useSettings();
  // TODO: move it to context and specify which fonts to use
  const fontFamilies: OptionItem[] = [
    { id: "Times New Roman", name: "Times New Roman" },
    { id: "monospace", name: "Monospace" },
    { id: "sans-serif", name: "Sans Serif" },
  ];

  const selectedFont = fontFamilies.find(
    (f) => f.id === captionSettings.style.fontFamily
  ) ?? { id: "monospace", name: "Monospace" };

  // TODO: Slider and color picker styling or complete re-write
  return (
    <PopoutSection className="overflow-auto">
      <Dropdown
        setSelectedItem={(e) => {
          setCaptionFontFamily(e.id);
        }}
        selectedItem={selectedFont}
        options={fontFamilies}
      />
      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white" htmlFor="fontSize">
          Font Size ({captionSettings.style.fontSize})
        </label>
        <input
          onChange={(e) => setCaptionFontSize(e.target.valueAsNumber)}
          type="range"
          name="fontSize"
          id="fontSize"
          max={30}
          min={10}
          step={1}
          value={captionSettings.style.fontSize}
        />
      </div>

      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white">
          Delay ({captionSettings.delay}s)
        </label>
        <input
          onChange={(e) => setCaptionDelay(e.target.valueAsNumber)}
          type="range"
          max={10 * 1000}
          min={-10 * 1000}
          step={1}
        />
      </div>

      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white" htmlFor="captionColor">
          Color
        </label>
        <input
          onChange={(e) => setCaptionColor(e.target.value)}
          type="color"
          name="captionColor"
          id="captionColor"
          value={captionSettings.style.color}
        />
      </div>

      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white" htmlFor="backgroundColor">
          Background Color
        </label>
        <input
          onChange={(e) => setCaptionBackgroundColor(`${e.target.value}cc`)}
          type="color"
          name="backgroundColor"
          id="backgroundColor"
          value={captionSettings.style.backgroundColor}
        />
      </div>
      <div className="flex flex-row justify-between py-2">
        <label
          className="font-bold text-white"
          htmlFor="backgroundColorOpacity"
        >
          Background Color Opacity
        </label>
        <input
          onChange={(e) =>
            setCaptionBackgroundColor(
              `${captionSettings.style.backgroundColor.substring(
                0,
                7
              )}${e.target.valueAsNumber.toString(16)}`
            )
          }
          type="range"
          min={0}
          max={255}
          name="backgroundColorOpacity"
          id="backgroundColorOpacity"
          value={Number.parseInt(
            captionSettings.style.backgroundColor.substring(7, 9),
            16
          )}
        />
      </div>
      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white" htmlFor="textShadowColor">
          Text Shadow Color
        </label>
        <input
          onChange={(e) => {
            const [offsetX, offsetY, blurRadius, color] =
              captionSettings.style.textShadow.split(" ");
            return setCaptionTextShadow(
              `${offsetX} ${offsetY} ${blurRadius} ${e.target.value}`
            );
          }}
          type="color"
          name="textShadowColor"
          id="textShadowColor"
          value={captionSettings.style.textShadow.split(" ")[3]}
        />
      </div>
      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white">Text Shadow (Offset X)</label>
        <input
          onChange={(e) => {
            const [offsetX, offsetY, blurRadius, color] =
              captionSettings.style.textShadow.split(" ");
            return setCaptionTextShadow(
              `${e.target.valueAsNumber}px ${offsetY} ${blurRadius} ${color}`
            );
          }}
          type="range"
          min={-10}
          max={10}
          value={parseFloat(captionSettings.style.textShadow.split("px")[0])}
        />
      </div>

      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white">Text Shadow (Offset Y)</label>
        <input
          onChange={(e) => {
            const [offsetX, offsetY, blurRadius, color] =
              captionSettings.style.textShadow.split(" ");
            return setCaptionTextShadow(
              `${offsetX} ${e.target.value}px ${blurRadius} ${color}`
            );
          }}
          type="range"
          min={-10}
          max={10}
          value={parseFloat(captionSettings.style.textShadow.split("px")[1])}
        />
      </div>

      <div className="flex flex-row justify-between py-2">
        <label className="font-bold text-white">Text Shadow Blur</label>
        <input
          onChange={(e) => {
            const [offsetX, offsetY, blurRadius, color] =
              captionSettings.style.textShadow.split(" ");

            return setCaptionTextShadow(
              `${offsetX} ${offsetY} ${e.target.valueAsNumber}px ${color}`
            );
          }}
          type="range"
          value={parseFloat(captionSettings.style.textShadow.split("px")[2])}
        />
      </div>
    </PopoutSection>
  );
}
