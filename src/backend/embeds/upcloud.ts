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

    let sources: { file: string; type: string } | null = null;

    if (!isJSON(streamRes.sources)) {
      const decryptionKey = JSON.parse(
        await proxiedFetch<string>(
          `https://raw.githubusercontent.com/enimax-anime/key/e4/key.txt`
        )
      ) as [number, number][];

      let extractedKey = "";
      const sourcesArray = streamRes.sources.split("");
      for (const index of decryptionKey) {
        for (let i: number = index[0]; i < index[1]; i += 1) {
          extractedKey += streamRes.sources[i];
          sourcesArray[i] = "";
        }
      }

      const decryptedStream = AES.decrypt(
        sourcesArray.join(""),
        extractedKey
      ).toString(enc.Utf8);
      const parsedStream = JSON.parse(decryptedStream)[0];
      if (!parsedStream) throw new Error("No stream found");
      sources = parsedStream;
    }

    if (!sources) throw new Error("upcloud source not found");

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
