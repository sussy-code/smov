import { MWEmbedType } from "@/backend/helpers/embed";
import { registerEmbedScraper } from "@/backend/helpers/register";
import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";

registerEmbedScraper({
  id: "playm4u",
  displayName: "playm4u",
  for: MWEmbedType.PLAYM4U,
  rank: 0,
  async getStream() {
    // throw new Error("Oh well 2")
    return {
      embedId: "",
      streamUrl: "",
      quality: MWStreamQuality.Q1080P,
      captions: [],
      type: MWStreamType.MP4,
    };
  },
});
