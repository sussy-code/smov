import { createVersionedStore } from "@/utils/storage";
import { MWSettingsData } from "./types";

export const SettingsStore = createVersionedStore<MWSettingsData>()
  .setKey("mw-settings")
  .addVersion({
    version: 0,
    create() {
      return {
        language: "en",
        captionSettings: {
          delay: 0,
          style: {
            color: "#ffffff",
            fontSize: 20,
            fontFamily: "inherit",
            textShadow: "2px 2px 2px black",
            backgroundColor: "#000000ff",
          },
        },
      } as MWSettingsData;
    },
  })
  .build();
