import { MWEmbedType } from "../helpers/embed";
import { registerProvider } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";
import { MWMediaType } from "../metadata/types";

registerProvider({
  id: "testprov",
  rank: 42,
  type: [MWMediaType.MOVIE],

  async scrape({ progress, imdbId, tmdbId }) {
    console.log("scraping provider for: ", imdbId, tmdbId);
    progress(25);
    progress(50);
    progress(75);

    // providers can optionally provide a stream themselves,
    // incase they host their own streams instead of using embeds
    return {
      stream: {
        streamUrl: "hello-world",
        type: MWStreamType.HLS,
        quality: MWStreamQuality.Q1080P,
      },
      embeds: [
        {
          type: MWEmbedType.OPENLOAD,
          url: "https://google.com",
        },
      ],
    };
  },
});
