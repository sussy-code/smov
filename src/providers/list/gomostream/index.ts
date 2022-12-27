import { unpack } from "unpacker";
import json5 from "json5";
import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWProviderMediaResult,
} from "@/providers/types";

import { conf } from "@/config";

export const gomostreamScraper: MWMediaProvider = {
  id: "gomostream",
  enabled: true,
  type: [MWMediaType.MOVIE],
  displayName: "gomostream",

  async getMediaFromPortable(
    media: MWPortableMedia
  ): Promise<MWProviderMediaResult> {
    const params = new URLSearchParams({
      apikey: conf().OMDB_API_KEY,
      i: media.mediaId,
      type: media.mediaType,
    });

    const res = await fetch(
      `${conf().CORS_PROXY_URL}http://www.omdbapi.com/?${encodeURIComponent(
        params.toString()
      )}`
    ).then((d) => d.json());

    return {
      ...media,
      title: res.Title,
      year: res.Year,
    } as MWProviderMediaResult;
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const term = query.searchQuery.toLowerCase();

    const params = new URLSearchParams({
      apikey: conf().OMDB_API_KEY,
      s: term,
      type: query.type,
    });
    const searchRes = await fetch(
      `${conf().CORS_PROXY_URL}http://www.omdbapi.com/?${encodeURIComponent(
        params.toString()
      )}`
    ).then((d) => d.json());

    const results: MWProviderMediaResult[] = (searchRes.Search || []).map(
      (d: any) =>
        ({
          title: d.Title,
          year: d.Year,
          mediaId: d.imdbID,
        } as MWProviderMediaResult)
    );

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    const type =
      media.mediaType === MWMediaType.SERIES ? "show" : media.mediaType;
    const res1 = await fetch(
      `${conf().CORS_PROXY_URL}https://gomo.to/${type}/${media.mediaId}`
    ).then((d) => d.text());
    if (res1 === "Movie not available." || res1 === "Episode not available.")
      throw new Error(res1);

    const tc = res1.match(/var tc = '(.+)';/)?.[1] || "";
    const _token = res1.match(/"_token": "(.+)",/)?.[1] || "";

    const fd = new FormData();
    fd.append("tokenCode", tc);
    fd.append("_token", _token);

    const src = await fetch(
      `${conf().CORS_PROXY_URL}https://gomo.to/decoding_v3.php`,
      {
        method: "POST",
        body: fd,
        headers: {
          "x-token": `${tc.slice(5, 13).split("").reverse().join("")}13574199`,
        },
      }
    ).then((d) => d.json());
    const embeds = src.filter((url: string) => url.includes("gomo.to"));

    // maybe try all embeds in the future
    const embedUrl = embeds[1];
    const res2 = await fetch(`${conf().CORS_PROXY_URL}${embedUrl}`).then((d) =>
      d.text()
    );

    const res2DOM = new DOMParser().parseFromString(res2, "text/html");
    if (res2DOM.body.innerText === "File was deleted")
      throw new Error("File was deleted");

    const script = Array.from(res2DOM.querySelectorAll("script")).find(
      (s: HTMLScriptElement) =>
        s.innerHTML.includes("eval(function(p,a,c,k,e,d")
    )?.innerHTML;
    if (!script) throw new Error("Could not get packed data");

    const unpacked = unpack(script);
    const rawSources = /sources:(\[.*?\])/.exec(unpacked);
    if (!rawSources) throw new Error("Could not get rawSources");

    const sources = json5.parse(rawSources[1]);
    const streamUrl = sources[0].file;

    const streamType = streamUrl.split(".").at(-1);
    if (streamType !== "mp4" && streamType !== "m3u8")
      throw new Error("Unsupported stream type");

    return { url: streamUrl, type: streamType, captions: [] };
  },
};
