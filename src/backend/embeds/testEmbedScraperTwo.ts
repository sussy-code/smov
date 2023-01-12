import { MWEmbedType } from "../helpers/embed";
import { registerEmbedScraper } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";

const timeout = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });

registerEmbedScraper({
  id: "testembedtwo",
  rank: 19,
  for: MWEmbedType.ANOTHER,

  async getStream({ progress }) {
    progress(75);
    await timeout(1000);
    return {
      streamUrl: "hello-world-5",
      type: MWStreamType.MP4,
      quality: MWStreamQuality.Q1080P,
    };
  },
});
