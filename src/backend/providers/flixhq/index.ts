import { MWEmbedType } from "@/backend/helpers/embed";
import { registerProvider } from "@/backend/helpers/register";
import { MWMediaType } from "@/backend/metadata/types/mw";
import {
  getFlixhqSourceDetails,
  getFlixhqSources,
} from "@/backend/providers/flixhq/scrape";
import { getFlixhqId } from "@/backend/providers/flixhq/search";

registerProvider({
  id: "flixhq",
  displayName: "FlixHQ",
  rank: 100,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  async scrape({ media }) {
    const id = await getFlixhqId(media.meta);
    if (!id) throw new Error("flixhq no matching item found");

    // TODO tv shows not supported. just need to scrape the specific episode sources

    const sources = await getFlixhqSources(id);
    const upcloudStream = sources.find(
      (v) => v.embed.toLowerCase() === "upcloud"
    );
    if (!upcloudStream) throw new Error("upcloud stream not found for flixhq");

    return {
      embeds: [
        {
          type: MWEmbedType.UPCLOUD,
          url: await getFlixhqSourceDetails(upcloudStream.episodeId),
        },
      ],
    };
  },
});
