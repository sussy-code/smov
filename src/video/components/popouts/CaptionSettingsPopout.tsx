import { FloatingCardView } from "@/components/popout/FloatingCard";
import { FloatingView } from "@/components/popout/FloatingView";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { useSettings } from "@/state/settings";
import { useTranslation } from "react-i18next";
import { ChangeEventHandler, useEffect, useRef } from "react";
import { Icon, Icons } from "@/components/Icon";

export type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueDisplay?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  stops?: number[];
};

export function Slider(props: SliderProps) {
  const ref = useRef<HTMLInputElement>(null);
  const stops = props.stops ?? [Math.floor((props.max + props.min) / 2)];
  useEffect(() => {
    const e = ref.current as HTMLInputElement;
    e.style.setProperty("--value", e.value);
    e.style.setProperty("--min", e.min === "" ? "0" : e.min);
    e.style.setProperty("--max", e.max === "" ? "100" : e.max);
    e.addEventListener("input", () => e.style.setProperty("--value", e.value));
  }, [ref]);

  return (
    <div className="mb-6 flex flex-row gap-4">
      <div className="flex w-full flex-col gap-2">
        <label className="font-bold">{props.label}</label>
        <input
          type="range"
          ref={ref}
          className="styled-slider slider-progress"
          onChange={props.onChange}
          value={props.value}
          max={props.max}
          min={props.min}
          step={props.step}
          list="stops"
        />
        <datalist id="stops">
          {stops.map((s) => (
            <option value={s} />
          ))}
        </datalist>
      </div>
      <div className="mt-1 aspect-[2/1] h-8 rounded-sm bg-[#1C161B] pt-1">
        <div className="text-center font-bold text-white">
          {props.valueDisplay ?? props.value}
        </div>
      </div>
    </div>
  );
}

export function CaptionSettingsPopout(props: {
  router: ReturnType<typeof useFloatingRouter>;
  prefix: string;
}) {
  // For now, won't add label texts to language files since options are prone to change
  const { t } = useTranslation();
  const {
    captionSettings,
    setCaptionBackgroundColor,
    setCaptionColor,
    setCaptionDelay,
    setCaptionFontSize,
  } = useSettings();
  const colors = ["#ffffff", "#00ffff", "#ffff00"];
  return (
    <FloatingView {...props.router.pageProps(props.prefix)} width={375}>
      <FloatingCardView.Header
        title={t("videoPlayer.popouts.captionPreferences.title")}
        description={t("videoPlayer.popouts.descriptions.captionPreferences")}
        goBack={() => props.router.navigate("/captions")}
      />
      <FloatingCardView.Content>
        <Slider
          label={t("videoPlayer.popouts.captionPreferences.delay")}
          max={10}
          min={-10}
          step={0.1}
          valueDisplay={`${captionSettings.delay.toFixed(1)}s`}
          value={captionSettings.delay}
          onChange={(e) => setCaptionDelay(e.target.valueAsNumber)}
          stops={[-5, 0, 5]}
        />
        <Slider
          label="Size"
          min={10}
          step={1}
          max={30}
          value={captionSettings.style.fontSize}
          onChange={(e) => setCaptionFontSize(e.target.valueAsNumber)}
        />
        <Slider
          label={t("videoPlayer.popouts.captionPreferences.opacity")}
          step={1}
          min={0}
          max={255}
          valueDisplay={`${(
            (parseInt(
              captionSettings.style.backgroundColor.substring(7, 9),
              16
            ) /
              255) *
            100
          ).toFixed(0)}%`}
          value={parseInt(
            captionSettings.style.backgroundColor.substring(7, 9),
            16
          )}
          onChange={(e) =>
            setCaptionBackgroundColor(
              `${captionSettings.style.backgroundColor.substring(
                0,
                7
              )}${e.target.valueAsNumber.toString(16)}`
            )
          }
        />
        <div className="flex flex-row justify-between">
          <label className="font-bold" htmlFor="color">
            {t("videoPlayer.popouts.captionPreferences.color")}
          </label>
          <div className="flex flex-row gap-2">
            {colors.map((color) => (
              <div
                className={`flex h-8 w-8 items-center justify-center rounded ${
                  color === captionSettings.style.color ? "bg-[#1C161B]" : ""
                }`}
              >
                <input
                  className="h-4 w-4 cursor-pointer appearance-none rounded-full"
                  type="radio"
                  name="color"
                  key={color}
                  value={color}
                  style={{
                    backgroundColor: color,
                  }}
                  onChange={(e) => setCaptionColor(e.target.value)}
                />
                <Icon
                  className={[
                    "absolute text-[#1C161B]",
                    color === captionSettings.style.color ? "" : "hidden",
                  ].join(" ")}
                  icon={Icons.CHECKMARK}
                />
              </div>
            ))}
          </div>
        </div>
      </FloatingCardView.Content>
    </FloatingView>
  );
}
