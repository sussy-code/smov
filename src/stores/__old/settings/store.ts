import { useLanguageStore } from "@/stores/language";
import { useSubtitleStore } from "@/stores/subtitles";

import { MWSettingsData, MWSettingsDataV1 } from "./types";
import { createVersionedStore } from "../migrations";

export const SettingsStore = createVersionedStore<Record<never, never>>()
  .setKey("mw-settings")
  .addVersion({
    version: 0,
    create(): MWSettingsDataV1 {
      return {
        language: "en",
        captionSettings: {
          delay: 0,
          style: {
            color: "#ffffff",
            fontSize: 25,
            backgroundColor: "#00000096",
          },
        },
      };
    },
    migrate(data: MWSettingsDataV1): MWSettingsData {
      return {
        language: data.language,
        captionSettings: {
          language: "none",
          ...data.captionSettings,
        },
      };
    },
  })
  .addVersion({
    version: 1,
    migrate(old: MWSettingsData): Record<never, never> {
      const langStore = useLanguageStore.getState();
      const subtitleStore = useSubtitleStore.getState();

      const backgroundColor = old.captionSettings.style.backgroundColor;
      let backgroundOpacity = 0.5;
      if (backgroundColor.length === 9) {
        const opacitySplit = backgroundColor.slice(7); // '#' + 6 digits
        backgroundOpacity = parseInt(opacitySplit, 16) / 255; // read as hex;
      }

      langStore.setLanguage(old.language);
      subtitleStore.updateStyling({
        backgroundOpacity,
        color: old.captionSettings.style.color,
        size: old.captionSettings.style.fontSize / 25,
      });
      subtitleStore.importSubtitleLanguage(
        old.captionSettings.language === "none"
          ? null
          : old.captionSettings.language,
      );

      return {};
    },
  })
  .addVersion({
    version: 2,
    create(): Record<never, never> {
      return {};
    },
  })
  .build();
