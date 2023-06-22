import CryptoJS from "crypto-js";
import { unpack } from "unpacker";

import { registerProvider } from "@/backend/helpers/register";
import { MWStreamQuality } from "@/backend/helpers/streams";
import { MWMediaType } from "@/backend/metadata/types/mw";

import { proxiedFetch } from "../helpers/fetch";

const format = {
  stringify: (cipher: any) => {
    const ct = cipher.ciphertext.toString(CryptoJS.enc.Base64);
    const iv = cipher.iv.toString() || "";
    const salt = cipher.salt.toString() || "";
    return JSON.stringify({
      ct,
      iv,
      salt,
    });
  },
  parse: (jsonStr: string) => {
    const json = JSON.parse(jsonStr);
    const ciphertext = CryptoJS.enc.Base64.parse(json.ct);
    const iv = CryptoJS.enc.Hex.parse(json.iv) || "";
    const salt = CryptoJS.enc.Hex.parse(json.s) || "";

    const cipher = CryptoJS.lib.CipherParams.create({
      ciphertext,
      iv,
      salt,
    });
    return cipher;
  },
};

registerProvider({
  id: "gdriveplayer",
  displayName: "gdriveplayer",
  disabled: true,
  rank: 69,
  type: [MWMediaType.MOVIE],

  async scrape({ progress, media: { imdbId } }) {
    if (!imdbId) throw new Error("not enough info");
    progress(10);
    const streamRes = await proxiedFetch<string>(
      "https://database.gdriveplayer.us/player.php",
      {
        params: {
          imdb: imdbId,
        },
      }
    );
    progress(90);
    const page = new DOMParser().parseFromString(streamRes, "text/html");

    const script: HTMLElement | undefined = Array.from(
      page.querySelectorAll("script")
    ).find((e) => e.textContent?.includes("eval"));

    if (!script || !script.textContent) {
      throw new Error("Could not find stream");
    }

    /// NOTE: this code requires re-write, it's not safe
    const data = unpack(script.textContent)
      .split("var data=\\'")[1]
      .split("\\'")[0]
      .replace(/\\/g, "");
    const decryptedData = unpack(
      CryptoJS.AES.decrypt(
        data,
        "alsfheafsjklNIWORNiolNIOWNKLNXakjsfwnBdwjbwfkjbJjkopfjweopjASoiwnrflakefneiofrt",
        { format }
      ).toString(CryptoJS.enc.Utf8)
    );

    // eslint-disable-next-line
    const sources = JSON.parse(
      JSON.stringify(
        eval(
          decryptedData
            .split("sources:")[1]
            .split(",image")[0]
            .replace(/\\/g, "")
            .replace(/document\.referrer/g, '""')
        )
      )
    );
    const source = sources[sources.length - 1];
    /// END

    let quality;
    if (source.label === "720p") quality = MWStreamQuality.Q720P;
    else quality = MWStreamQuality.QUNKNOWN;

    return {
      stream: {
        streamUrl: `https:${source.file}`,
        type: source.type,
        quality,
        captions: [],
      },
      embeds: [],
    };
  },
});
