import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWProviderMediaResult
} from "providers/types";

import { CORS_PROXY_URL } from "mw_constants";
import { unpack } from "unpacker";
import CryptoJS from "crypto-js";

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
  }
};

export const gDrivePlayerScraper: MWMediaProvider = {
  id: "gdriveplayer",
  enabled: true,
  type: [MWMediaType.MOVIE],
  displayName: "gdriveplayer",

  async getMediaFromPortable(media: MWPortableMedia): Promise<MWProviderMediaResult> {
    const res = await fetch(`${CORS_PROXY_URL}https://api.gdriveplayer.us/v1/imdb/${media.mediaId}`).then((d) => d.json());

    return {
      ...media,
      title: res.Title,
      year: res.Year,
    } as MWProviderMediaResult;
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const searchRes = await fetch(`${CORS_PROXY_URL}https://api.gdriveplayer.us/v1/movie/search?title=${query.searchQuery}`).then((d) => d.json());

    const results: MWProviderMediaResult[] = (searchRes || []).map((item: any) => ({
      title: item.title,
      year: item.year,
      mediaId: item.imdb,
    }));

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    const streamRes = await fetch(`${CORS_PROXY_URL}https://database.gdriveplayer.us/player.php?imdb=${media.mediaId}`).then((d) => d.text());
    const page = new DOMParser().parseFromString(streamRes, "text/html");

    const script: HTMLElement | undefined = Array.from(
      page.querySelectorAll("script")
    ).find((e) => e.textContent?.includes("eval"));

    if (!script || !script.textContent) {
      throw new Error("Could not find stream");
    }

    /// NOTE: this code requires re-write, it's not safe
    const data = unpack(script.textContent).split("var data=\\'")[1].split("\\'")[0].replace(/\\/g, "");
    const decryptedData = unpack(CryptoJS.AES.decrypt(data, "alsfheafsjklNIWORNiolNIOWNKLNXakjsfwnBdwjbwfkjbJjkopfjweopjASoiwnrflakefneiofrt", { format }).toString(CryptoJS.enc.Utf8));
    // eslint-disable-next-line
    const sources = JSON.parse(JSON.stringify(eval(decryptedData.split("sources:")[1].split(",image")[0].replace(/\\/g, "").replace(/document\.referrer/g, "\"\""))));
    const source = sources[sources.length - 1];
    /// END

    return { url: `https:${source.file}`, type: source.type, captions: [] };
  },
};
