import classNames from "classnames";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/buttons/Button";
import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import {
  CaptionSetting,
  ColorOption,
  colors,
} from "@/components/player/atoms/settings/CaptionSettingsView";
import { Menu } from "@/components/player/internals/ContextMenu";
import { CaptionCue } from "@/components/player/Player";
import { Heading1 } from "@/components/utils/Text";
import { Transition } from "@/components/utils/Transition";
import { SubtitleStyling, useSubtitleStore } from "@/stores/subtitles";

export function CaptionPreview(props: {
  fullscreen?: boolean;
  show?: boolean;
  styling: SubtitleStyling;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={classNames({
        "pointer-events-none overflow-hidden w-full rounded": true,
        "aspect-video relative": !props.fullscreen,
        "fixed inset-0 z-[60]": props.fullscreen,
      })}
    >
      {props.fullscreen && props.show ? (
        <Helmet>
          <html data-no-scroll />
        </Helmet>
      ) : null}
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
                text={t("settings.subtitles.previewQuote") ?? undefined}
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

export function CaptionsPart(props: {
  styling: SubtitleStyling;
  setStyling: (s: SubtitleStyling) => void;
}) {
  const { t } = useTranslation();
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const subtitleStore = useSubtitleStore();

  useEffect(() => {
    subtitleStore.updateStyling(props.styling);
  }, [props.styling, subtitleStore, subtitleStore.updateStyling]);

  const handleStylingChange = (newStyling: SubtitleStyling) => {
    props.setStyling(newStyling);
    subtitleStore.updateStyling(newStyling);
  };

  const resetSubStyling = () => {
    subtitleStore.resetStyling();
    props.setStyling({
      color: "#ffffff",
      backgroundOpacity: 0.5,
      size: 1,
      backgroundBlur: 0.5,
      bold: false,
    });
  };

  return (
    <div>
      <Heading1 border>{t("settings.subtitles.title")}</Heading1>
      <div className="grid md:grid-cols-[1fr,356px] gap-8">
        <div className="space-y-6">
          <CaptionSetting
            label={t("settings.subtitles.backgroundLabel")}
            max={100}
            min={0}
            onChange={(v) =>
              handleStylingChange({
                ...props.styling,
                backgroundOpacity: v / 100,
              })
            }
            value={props.styling.backgroundOpacity * 100}
            textTransformer={(s) => `${s}%`}
          />
          <CaptionSetting
            label={t("settings.subtitles.backgroundBlurLabel")}
            max={100}
            min={0}
            onChange={(v) =>
              handleStylingChange({
                ...props.styling,
                backgroundBlur: v / 100,
              })
            }
            value={props.styling.backgroundBlur * 100}
            textTransformer={(s) => `${s}%`}
          />
          <CaptionSetting
            label={t("settings.subtitles.textSizeLabel")}
            max={200}
            min={1}
            textTransformer={(s) => `${s}%`}
            onChange={(v) =>
              handleStylingChange({
                ...props.styling,
                size: v / 100,
              })
            }
            value={props.styling.size * 100}
          />
          <div className="flex justify-between items-center">
            <Menu.FieldTitle>
              {t("settings.subtitles.textBoldLabel")}
            </Menu.FieldTitle>
            <div className="flex justify-center items-center">
              <Toggle
                enabled={props.styling.bold}
                onClick={() =>
                  handleStylingChange({
                    ...props.styling,
                    bold: !props.styling.bold,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Menu.FieldTitle>
              {t("settings.subtitles.colorLabel")}
            </Menu.FieldTitle>
            <div className="flex justify-center items-center space-x-2">
              {colors.map((v) => (
                <ColorOption
                  onClick={() =>
                    handleStylingChange({
                      ...props.styling,
                      color: v,
                    })
                  }
                  color={v}
                  active={props.styling.color === v}
                  key={v}
                />
              ))}
              {/* Add Color Picker */}
              <div className="relative">
                <input
                  type="color"
                  value={props.styling.color}
                  onChange={(e) => {
                    const color = e.target.value;
                    handleStylingChange({ ...props.styling, color });
                    subtitleStore.updateStyling({
                      ...props.styling,
                      color,
                    });
                  }}
                  className="absolute opacity-0 cursor-pointer w-8 h-8"
                />
                <div style={{ color: props.styling.color }}>
                  <Icon icon={Icons.BRUSH} className="text-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CaptionPreview
          show
          styling={props.styling}
          onToggle={() => setFullscreenPreview((s) => !s)}
        />
        <CaptionPreview
          show={fullscreenPreview}
          fullscreen
          styling={props.styling}
          onToggle={() => setFullscreenPreview((s) => !s)}
        />
        <Button
          className="w-full md:w-auto"
          theme="secondary"
          onClick={resetSubStyling}
        >
          {t("settings.reset")}
        </Button>
      </div>
    </div>
  );
}
