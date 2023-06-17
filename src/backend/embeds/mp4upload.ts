import { MWEmbedType } from "@/backend/helpers/embed";
import { registerEmbedScraper } from "@/backend/helpers/register";
import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";

import { proxiedFetch } from "../helpers/fetch";

registerEmbedScraper({
  id: "mp4upload",
  displayName: "mp4upload",
  for: MWEmbedType.MP4UPLOAD,
  rank: 170,
  async getStream({ url }) {
    const embed = await proxiedFetch<any>(url);

    const playerSrcRegex =
      /(?<=player\.src\()\s*{\s*type:\s*"[^"]+",\s*src:\s*"([^"]+)"\s*}\s*(?=\);)/s;

    const playerSrc = embed.match(playerSrcRegex);

    const streamUrl = playerSrc[1];

    if (!streamUrl) throw new Error("Stream url not found");

    return {
      embedId: MWEmbedType.MP4UPLOAD,
      streamUrl,
      quality: MWStreamQuality.Q1080P,
      captions: [],
      type: MWStreamType.MP4,
    };
  },
});
