import { registerProvider } from "../helpers/register";
import { MWMediaType } from "../metadata/types";

const timeout = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });

registerProvider({
  id: "testprov",
  rank: 42,
  type: [MWMediaType.MOVIE],
  disabled: true,

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
        // {
        //   type: MWEmbedType.OPENLOAD,
        //   url: "https://google.com",
        // },
        // {
        //   type: MWEmbedType.ANOTHER,
        //   url: "https://google.com",
        // },
      ],
    };
  },
});
