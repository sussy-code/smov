import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWProviderMediaResult,
  MWMediaCaption
} from "providers/types";

import { CORS_PROXY_URL } from "mw_constants";

export const xemovieScraper: MWMediaProvider = {
  id: "xemovie",
  enabled: false,
  type: [MWMediaType.MOVIE],
  displayName: "xemovie",

  async getMediaFromPortable(media: MWPortableMedia): Promise<MWProviderMediaResult> {
    const res = await fetch(
      `${CORS_PROXY_URL}https://xemovie.co/movies/${media.mediaId}/watch`,
    ).then(d => d.text());

    const DOM = new DOMParser().parseFromString(res, "text/html");

    const title = DOM.querySelector(".text-primary.text-lg.font-extrabold")?.textContent || "";
    const year = DOM.querySelector("div.justify-between:nth-child(3) > div:nth-child(2)")?.textContent || "";

    return {
      ...media,
      title,
      year,
    } as MWProviderMediaResult;
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const term = query.searchQuery.toLowerCase();

    const searchUrl = `${CORS_PROXY_URL}https://xemovie.co/search?q=${encodeURIComponent(term)}`;
    const searchRes = await fetch(searchUrl).then((d) => d.text());

    const parser = new DOMParser();
    const doc = parser.parseFromString(searchRes, "text/html");

    const movieContainer = doc.querySelectorAll(".py-10")[0].querySelector(".grid");
    if (!movieContainer) return [];
    const movieNodes = Array.from(movieContainer.querySelectorAll("a")).filter(link => !link.className);

    const results: MWProviderMediaResult[] = movieNodes.map((node) => {
      const parent = node.parentElement;
      if (!parent) return;

      const aElement = parent.querySelector("a");
      if (!aElement) return;

      return {
        title: parent.querySelector("div > div > a > h6")?.textContent,
        year: parent.querySelector("div.float-right")?.textContent,
        mediaId: aElement.href.split('/').pop() || "",
      }
    }).filter((d): d is MWProviderMediaResult => !!d);

    return results;
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    if (media.mediaType !== MWMediaType.MOVIE) throw new Error("Incorrect type")

    const url = `${CORS_PROXY_URL}https://xemovie.co/movies/${media.mediaId}/watch`;

    let streamUrl = "";
    const subtitles: MWMediaCaption[] = [];

    const res = await fetch(url).then(d => d.text());
    const scripts = Array.from(new DOMParser().parseFromString(res, "text/html").querySelectorAll("script"));

    for (const script of scripts) {
      if (!script.textContent) continue;

      if (script.textContent.match(/https:\/\/[a-z][0-9]\.xemovie\.com/)) {
        const data = JSON.parse(JSON.stringify(eval(`(${script.textContent.replace("const data = ", "").split("};")[0]}})`)));
        streamUrl = data.playlist[0].file;

        for (const [index, subtitleTrack] of data.playlist[0].tracks.entries()) {
          const subtitleBlob = URL.createObjectURL(
            await fetch(`${CORS_PROXY_URL}${subtitleTrack.file}`).then((captionRes) => captionRes.blob())
          ); // do this so no need for CORS errors

          subtitles.push({
            id: index,
            url: subtitleBlob,
            label: subtitleTrack.label
          })
        }
      }
    }

    const streamType = streamUrl.split('.').at(-1);
    if (streamType !== "mp4" && streamType !== "m3u8") throw new Error("Unsupported stream type");

    return { url: streamUrl, type: streamType, captions: subtitles } as MWMediaStream;
  }
};
