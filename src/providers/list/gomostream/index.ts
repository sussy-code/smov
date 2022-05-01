import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWProviderMediaResult
} from "providers/types";

import { CORS_PROXY_URL, OMDB_API_KEY } from "mw_constants";
import { unpack } from "unpacker";

export const gomostreamScraper: MWMediaProvider = {
  id: "gomostream",
  enabled: true,
  type: [MWMediaType.MOVIE],
  displayName: "gomostream",

  async getMediaFromPortable(media: MWPortableMedia): Promise<MWProviderMediaResult> {
    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      i: media.mediaId,
      type: media.mediaType
    });

    const res = await fetch(
      `${CORS_PROXY_URL}http://www.omdbapi.com/?${encodeURIComponent(params.toString())}`,
    ).then(d => d.json())

    return {
      ...media,
      title: res.Title,
      year: res.Year
    } as MWProviderMediaResult;
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const term = query.searchQuery.toLowerCase();

    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      s: term,
      type: query.type
    });
    const searchRes = await fetch(
      `${CORS_PROXY_URL}http://www.omdbapi.com/?${encodeURIComponent(params.toString())}`,
    ).then(d => d.json())

    const results: MWProviderMediaResult[] = (searchRes.Search || []).map((d: any) => ({
      title: d.Title,
      year: d.Year,
      mediaId: d.imdbID
    } as MWProviderMediaResult));

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    const type = media.mediaType === MWMediaType.SERIES ? 'show' : media.mediaType;
    const res1 = await fetch(`${CORS_PROXY_URL}https://gomo.to/${type}/${media.mediaId}`).then((d) => d.text());
    if (res1 === "Movie not available." || res1 === "Episode not available.") throw new Error(res1);

    const tc = res1.match(/var tc = '(.+)';/)?.[1] || "";
    const _token = res1.match(/"_token": "(.+)",/)?.[1] || "";

    const fd = new FormData()
    fd.append('tokenCode', tc)
    fd.append('_token', _token)

    const src = await fetch(`${CORS_PROXY_URL}https://gomo.to/decoding_v3.php`, {
      method: "POST",
      body: fd,
      headers: {
        'x-token': `${tc.slice(5, 13).split("").reverse().join("")}13574199`
      }
    }).then((d) => d.json());

    const embedUrl = src.find((url: string) => url.includes('gomo.to'));
    const res2 = await fetch(`${CORS_PROXY_URL}${embedUrl}`).then((d) => d.text());

    const res2DOM = new DOMParser().parseFromString(res2, "text/html");
    if (res2DOM.body.innerText === "File was deleted") throw new Error("File was deleted");

    const script = res2DOM.querySelectorAll("script")[8].innerHTML;
    const unpacked = unpack(script).split('');
    unpacked.splice(0, 43);
    const index = unpacked.findIndex((e) => e === '"');
    const streamUrl = unpacked.slice(0, index).join('');

    const streamType = streamUrl.split('.').at(-1);
    if (streamType !== "mp4" && streamType !== "m3u8") throw new Error("Unsupported stream type");

    return { url: streamUrl, type: streamType, captions: [] };
  }
};
