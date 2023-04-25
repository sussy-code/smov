import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import CaptionColorSelector, {
  colors,
} from "@/components/CaptionColorSelector";
import { Dropdown } from "@/components/Dropdown";
import { Icon, Icons } from "@/components/Icon";
import { Modal, ModalCard } from "@/components/layout/Modal";
import { Slider } from "@/components/Slider";
import { conf } from "@/setup/config";
import { appLanguageOptions } from "@/setup/i18n";
import {
  CaptionLanguageOption,
  LangCode,
  captionLanguages,
} from "@/setup/iso6391";
import { useSettings } from "@/state/settings";
import { CaptionCue } from "@/video/components/actions/CaptionRendererAction";

export default function SettingsModal(props: {
  onClose: () => void;
  show: boolean;
}) {
  const {
    captionSettings,
    language,
    setLanguage,
    setCaptionLanguage,
    setCaptionBackgroundColor,
    setCaptionFontSize,
  } = useSettings();
  const { t, i18n } = useTranslation();

  const selectedCaptionLanguage = useMemo(
    () => captionLanguages.find((l) => l.id === captionSettings.language),
    [captionSettings.language]
  ) as CaptionLanguageOption;
  const appLanguage = useMemo(
    () => appLanguageOptions.find((l) => l.id === language),
    [language]
  ) as CaptionLanguageOption;
  const captionBackgroundOpacity = (
    (parseInt(captionSettings.style.backgroundColor.substring(7, 9), 16) /
      255) *
    100
  ).toFixed(0);
  return (
    <Modal show={props.show}>
      <ModalCard className="text-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="text-xl font-bold">{t("settings.title")}</span>
            <div
              onClick={() => props.onClose()}
              className="hover:cursor-pointer"
            >
              <Icon icon={Icons.X} />
            </div>
          </div>
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:w-1/2">
              <div className="flex flex-col justify-between">
                <label className="text-md font-semibold">
                  {t("settings.language")}
                </label>
                <Dropdown
                  selectedItem={appLanguage}
                  setSelectedItem={(val) => {
                    i18n.changeLanguage(val.id);
                    setLanguage(val.id as LangCode);
                  }}
                  options={appLanguageOptions}
                />
              </div>
              <div className="flex flex-col justify-between">
                <label className="text-md font-semibold">
                  {t("settings.captionLanguage")}
                </label>
                <Dropdown
                  selectedItem={selectedCaptionLanguage}
                  setSelectedItem={(val) => {
                    setCaptionLanguage(val.id as LangCode);
                  }}
                  options={captionLanguages}
                />
              </div>
              <div className="flex flex-col justify-between">
                <Slider
                  label={
                    t(
                      "videoPlayer.popouts.captionPreferences.fontSize"
                    ) as string
                  }
                  min={14}
                  step={1}
                  max={60}
                  value={captionSettings.style.fontSize}
                  onChange={(e) => setCaptionFontSize(e.target.valueAsNumber)}
                />
                <Slider
                  label={
                    t(
                      "videoPlayer.popouts.captionPreferences.opacity"
                    ) as string
                  }
                  step={1}
                  min={0}
                  max={255}
                  valueDisplay={`${captionBackgroundOpacity}%`}
                  value={parseInt(
                    captionSettings.style.backgroundColor.substring(7, 9),
                    16
                  )}
                  onChange={(e) =>
                    setCaptionBackgroundColor(e.target.valueAsNumber)
                  }
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
              </div>
              <div />
            </div>
            <div className="flex w-full flex-col justify-center">
              <div className="flex aspect-video flex-col justify-end rounded bg-zinc-800">
                <div className="pointer-events-none flex w-full flex-col items-center transition-[bottom]">
                  <CaptionCue
                    scale={0.5}
                    text={selectedCaptionLanguage.nativeName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float-right mt-1 text-sm">v{conf().APP_VERSION}</div>
      </ModalCard>
    </Modal>
  );
}
