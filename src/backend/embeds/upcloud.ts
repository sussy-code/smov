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

function extractKey(script: string): [number, number][] | null {
  const startOfSwitch = script.lastIndexOf("switch");
  const endOfCases = script.indexOf("partKeyStartPosition");
  const switchBody = script.slice(startOfSwitch, endOfCases);

  const nums: [number, number][] = [];
  const matches = switchBody.matchAll(
    /:[a-zA-Z0-9]+=([a-zA-Z0-9]+),[a-zA-Z0-9]+=([a-zA-Z0-9]+);/g
  );
  for (const match of matches) {
    const innerNumbers: number[] = [];
    for (const varMatch of [match[1], match[2]]) {
      const regex = new RegExp(`${varMatch}=0x([a-zA-Z0-9]+)`, "g");
      const varMatches = [...script.matchAll(regex)];
      const lastMatch = varMatches[varMatches.length - 1];
      if (!lastMatch) return null;
      const number = parseInt(lastMatch[1], 16);
      innerNumbers.push(number);
    }

    nums.push([innerNumbers[0], innerNumbers[1]]);
  }

  return nums;
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
      const scriptJs = await proxiedFetch<string>(
        `https://rabbitstream.net/js/player/prod/e4-player.min.js`,
        {
          responseType: "text" as any,
        }
      );
      const decryptionKey = extractKey(scriptJs);
      if (!decryptionKey) throw new Error("Key extraction failed");

      let extractedKey = "";
      let strippedSources = streamRes.sources;
      let totalledOffset = 0;
      decryptionKey.forEach(([a, b]) => {
        const start = a + totalledOffset;
        const end = start + b;
        extractedKey += streamRes.sources.slice(start, end);
        strippedSources = strippedSources.replace(
          streamRes.sources.substring(start, end),
          ""
        );
        totalledOffset += b;
      });

      const decryptedStream = AES.decrypt(
        strippedSources,
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
