import { AES, enc } from "crypto-js";

import { MWEmbedType } from "@/backend/helpers/embed";
import { registerEmbedScraper } from "@/backend/helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "@/backend/helpers/streams";

import { proxiedFetch } from "../helpers/fetch";

interface StreamRes {
  server: number;
  sources: string;
  tracks: {
    file: string;
    kind: "captions" | "thumbnails";
    label: string;
  }[];
}

function isJSON(json: string) {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

registerEmbedScraper({
  id: "upcloud",
  displayName: "UpCloud",
  for: MWEmbedType.UPCLOUD,
  rank: 200,
  disabled: true, // encryption broke
  async getStream({ url }) {
    // Example url: https://dokicloud.one/embed-4/{id}?z=
    const parsedUrl = new URL(url.replace("embed-5", "embed-4"));

    const dataPath = parsedUrl.pathname.split("/");
    const dataId = dataPath[dataPath.length - 1];

    const streamRes = await proxiedFetch<StreamRes>(
      `${parsedUrl.origin}/ajax/embed-4/getSources?id=${dataId}`,
      {
        headers: {
          Referer: parsedUrl.origin,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    let sources:
      | {
          file: string;
          type: string;
        }
      | string = streamRes.sources;

    if (!isJSON(sources) || typeof sources === "string") {
      const decryptionKey = await proxiedFetch<string>(
        `https://raw.githubusercontent.com/enimax-anime/key/e4/key.txt`
      );

      const decryptedStream = AES.decrypt(sources, decryptionKey).toString(
        enc.Utf8
      );

      const parsedStream = JSON.parse(decryptedStream)[0];
      if (!parsedStream) throw new Error("No stream found");
      sources = parsedStream as { file: string; type: string };
    }

    return {
      embedId: MWEmbedType.UPCLOUD,
      streamUrl: sources.file,
      quality: MWStreamQuality.Q1080P,
      type: MWStreamType.HLS,
      captions: streamRes.tracks
        .filter((sub) => sub.kind === "captions")
        .map((sub) => {
          return {
            langIso: sub.label,
            url: sub.file,
            type: sub.file.endsWith("vtt")
              ? MWCaptionType.VTT
              : MWCaptionType.UNKNOWN,
          };
        }),
    };
  },
});
