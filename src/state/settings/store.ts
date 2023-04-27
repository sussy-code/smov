import { createVersionedStore } from "@/utils/storage";

import { MWSettingsData, MWSettingsDataV1 } from "./types";

export const SettingsStore = createVersionedStore<MWSettingsData>()
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
    create(): MWSettingsData {
      return {
        language: "en",
        captionSettings: {
          delay: 0,
          language: "none",
          style: {
            color: "#ffffff",
            fontSize: 25,
            backgroundColor: "#00000096",
          },
        },
      };
    },
  })
  .build();
