import { createVersionedStore } from "@/utils/storage";
import { MWSettingsData } from "./types";

export const SettingsStore = createVersionedStore<MWSettingsData>()
  .setKey("mw-settings")
  .addVersion({
    version: 0,
    create(): MWSettingsData {
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
  })
  .build();
