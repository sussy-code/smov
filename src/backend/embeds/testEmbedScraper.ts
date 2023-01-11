import { MWEmbedType } from "../helpers/embed";
import { registerEmbedScraper } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";

registerEmbedScraper({
  id: "testembed",
  rank: 23,
  for: MWEmbedType.OPENLOAD,

  async getStream({ progress, url }) {
    console.log("scraping url: ", url);
    progress(25);
    progress(50);
    progress(75);
    return {
      streamUrl: "hello-world",
      type: MWStreamType.MP4,
      quality: MWStreamQuality.Q1080P,
    };
  },
});
