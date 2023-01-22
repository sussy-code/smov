import { unpack } from "unpacker";
import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";
import { MWMediaType } from "../metadata/types";
import json5 from "json5";

const gomoBase = "https://gomo.to/";

registerProvider({
  id: "gomostream",
  displayName: "gomostream",
  rank: 999,
  type: [MWMediaType.MOVIE],

  async scrape({ media, progress }) {
    // get movie from gomostream
    const contentResult = await proxiedFetch<any>(
      `/${media.meta.type}/${media.imdbId}`,
      {
        baseURL: gomoBase,
      }
    );

    // movie doesn't exist
    if (
      contentResult === "Movie not available." ||
      contentResult === "Episode not available."
    )
      throw new Error("No watchable item found.");

    // decode stream
    progress(25);

    const tc = contentResult.match(/var tc = '(.+)';/)?.[1] || "";
    const _token = contentResult.match(/"_token": "(.+)",/)?.[1] || "";

    const fd = new FormData();
    fd.append("tokenCode", tc);
    fd.append("_token", _token);

    const src = await proxiedFetch<any>(`/decoding_v3.php`, {
      baseURL: gomoBase,
      method: "POST",
      body: fd,
      headers: {
        "x-token": `${tc.slice(5, 13).split("").reverse().join("")}13574199`,
      },
      parseResponse: JSON.parse,
    });

    // TODO should check all embed urls in future
    const embedUrl = src.filter((url: string) => url.includes("gomo.to"))[1];

    // get stream info
    progress(50);

    const streamRes = await proxiedFetch<any>(embedUrl);

    const streamResDom = new DOMParser().parseFromString(
      streamRes,
      "text/html"
    );
    if (streamResDom.body.innerText === "File was deleted")
      throw new Error("No watchable item found.");

    const script = Array.from(streamResDom.querySelectorAll("script")).find(
      (s: HTMLScriptElement) =>
        s.innerHTML.includes("eval(function(p,a,c,k,e,d")
    )?.innerHTML;
    if (!script) throw new Error("Could not get packed data");

    // unpack data
    progress(75);

    const unpacked = unpack(script);
    const rawSources = /sources:(\[.*?\])/.exec(unpacked);
    if (!rawSources) throw new Error("Could not get stream URL");

    const sources = json5.parse(rawSources[1]);
    const streamUrl = sources[0].file;

    console.log(sources);

    const streamType = streamUrl.split(".").at(-1);
    if (streamType !== "mp4" && streamType !== "m3u8")
      throw new Error("Unsupported stream type");

    return {
      embeds: [],
      stream: {
        quality: streamType,
        streamUrl: streamUrl,
        type: streamType,
      },
    };
  },
});
