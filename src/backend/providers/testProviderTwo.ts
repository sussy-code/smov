import { MWEmbedType } from "../helpers/embed";
import { registerProvider } from "../helpers/register";
import { MWMediaType } from "../metadata/types";

const timeout = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });

registerProvider({
  id: "testprov2",
  rank: 40,
  type: [MWMediaType.MOVIE],

  async scrape({ progress }) {
    await timeout(1000);
    progress(25);
    await timeout(1000);
    progress(50);
    await timeout(1000);
    progress(75);
    await timeout(1000);

    return {
      embeds: [
        {
          type: MWEmbedType.OPENLOAD,
          url: "https://google.com",
        },
        {
          type: MWEmbedType.ANOTHER,
          url: "https://google.com",
        },
      ],
    };
  },
});
