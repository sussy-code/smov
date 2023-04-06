import { Dropdown } from "@/components/Dropdown";
import { Icon, Icons } from "@/components/Icon";
import { Modal, ModalCard } from "@/components/layout/Modal";
import { useSettings } from "@/state/settings";
import { useTranslation } from "react-i18next";
import { CaptionCue } from "@/video/components/actions/CaptionRendererAction";
import { Slider } from "@/video/components/popouts/CaptionSettingsPopout";
import { LangCode, captionLanguages } from "@/setup/iso6391";
import { useMemo } from "react";
import { appLanguageOptions } from "@/setup/i18n";

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
    setCaptionColor,
    setCaptionFontSize,
  } = useSettings();
  const { t, i18n } = useTranslation();

  const colors = ["#ffffff", "#00ffff", "#ffff00"];
  const selectedCaptionLanguage = useMemo(
    () => captionLanguages.find((l) => l.id === captionSettings.language)!,
    [captionSettings.language]
  );
  const captionBackgroundOpacity = (
    (parseInt(captionSettings.style.backgroundColor.substring(7, 9), 16) /
      255) *
    100
  ).toFixed(0);
  return (
    <Modal show={props.show}>
      <ModalCard className="bg-ash-300 text-white">
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
                  selectedItem={
                    appLanguageOptions.find((l) => l.id === language)!
                  }
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
                  label="Size"
                  min={14}
                  step={1}
                  max={60}
                  value={captionSettings.style.fontSize}
                  onChange={(e) => setCaptionFontSize(e.target.valueAsNumber)}
                />
                <Slider
                  label={t("videoPlayer.popouts.captionPreferences.opacity")}
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
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded transition-[background-color,transform] duration-100 hover:bg-[#1c161b79] active:scale-110 ${
                          color === captionSettings.style.color
                            ? "bg-[#1C161B]"
                            : ""
                        }`}
                        onClick={() => setCaptionColor(color)}
                      >
                        <div
                          className="h-4 w-4 cursor-pointer appearance-none rounded-full"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                        <Icon
                          className={[
                            "absolute text-xs text-[#1C161B]",
                            color === captionSettings.style.color
                              ? ""
                              : "hidden",
                          ].join(" ")}
                          icon={Icons.CHECKMARK}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div />
            </div>
            <div className="flex w-full flex-col justify-center">
              <div className="flex aspect-video flex-col justify-end rounded bg-zinc-800">
                {selectedCaptionLanguage.id !== "none" ? (
                  <div className="pointer-events-none flex w-full flex-col items-center transition-[bottom]">
                    <CaptionCue
                      scale={0.5}
                      text={selectedCaptionLanguage.nativeName}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </ModalCard>
    </Modal>
  );
}
