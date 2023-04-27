import { useTranslation } from "react-i18next";

import CaptionColorSelector, {
  colors,
} from "@/components/CaptionColorSelector";
import { FloatingCardView } from "@/components/popout/FloatingCard";
import { FloatingView } from "@/components/popout/FloatingView";
import { Slider } from "@/components/Slider";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { useSettings } from "@/state/settings";

export function CaptionSettingsPopout(props: {
  router: ReturnType<typeof useFloatingRouter>;
  prefix: string;
}) {
  // For now, won't add label texts to language files since options are prone to change
  const { t } = useTranslation();
  const {
    captionSettings,
    setCaptionBackgroundColor,
    setCaptionDelay,
    setCaptionFontSize,
  } = useSettings();
  return (
    <FloatingView {...props.router.pageProps(props.prefix)} width={375}>
      <FloatingCardView.Header
        title={t("videoPlayer.popouts.captionPreferences.title")}
        description={t("videoPlayer.popouts.descriptions.captionPreferences")}
        goBack={() => props.router.navigate("/captions")}
      />
      <FloatingCardView.Content>
        <Slider
          label={t("videoPlayer.popouts.captionPreferences.delay") as string}
          max={10}
          min={-10}
          step={0.1}
          valueDisplay={`${captionSettings.delay.toFixed(1)}s`}
          value={captionSettings.delay}
          onChange={(e) => setCaptionDelay(e.target.valueAsNumber)}
        />
        <Slider
          label={t("videoPlayer.popouts.captionPreferences.fontSize") as string}
          min={14}
          step={1}
          max={60}
          value={captionSettings.style.fontSize}
          onChange={(e) => setCaptionFontSize(e.target.valueAsNumber)}
        />
        <Slider
          label={t("videoPlayer.popouts.captionPreferences.opacity") as string}
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
          onChange={(e) => setCaptionBackgroundColor(e.target.valueAsNumber)}
        />
        <div className="flex flex-row justify-between">
          <label className="font-bold" htmlFor="color">
            {t("videoPlayer.popouts.captionPreferences.color")}
          </label>
          <div className="flex flex-row gap-2">
            {colors.map((color) => (
              <CaptionColorSelector color={color} />
            ))}
          </div>
        </div>
      </FloatingCardView.Content>
    </FloatingView>
  );
}
