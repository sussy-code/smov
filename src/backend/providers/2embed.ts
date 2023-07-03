import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

import { proxiedFetch, rawProxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "../helpers/streams";
import { MWMediaType } from "../metadata/types/mw";

const twoEmbedBase = "https://www.2embed.to";

async function fetchCaptchaToken(recaptchaKey: string) {
  const domainHash = Base64.stringify(Utf8.parse(twoEmbedBase)).replace(
    /=/g,
    "."
  );

  const recaptchaRender = await proxiedFetch<any>(
    `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`
  );

  const vToken = recaptchaRender.substring(
    recaptchaRender.indexOf("/releases/") + 10,
    recaptchaRender.indexOf("/recaptcha__en.js")
  );

  const recaptchaAnchor = await proxiedFetch<any>(
    `https://www.google.com/recaptcha/api2/anchor?ar=1&hl=en&size=invisible&cb=flicklax&k=${recaptchaKey}&co=${domainHash}&v=${vToken}`
  );

  const cToken = new DOMParser()
    .parseFromString(recaptchaAnchor, "text/html")
    .getElementById("recaptcha-token")
    ?.getAttribute("value");

  if (!cToken) throw new Error("Unable to find cToken");

  const payload = {
    v: vToken,
    reason: "q",
    k: recaptchaKey,
    c: cToken,
    sa: "",
    co: twoEmbedBase,
  };

  const tokenData = await proxiedFetch<string>(
    `https://www.google.com/recaptcha/api2/reload?${new URLSearchParams(
      payload
    ).toString()}`,
    {
      headers: { referer: "https://www.google.com/recaptcha/api2/" },
      method: "POST",
    }
  );

  const token = tokenData.match('rresp","(.+?)"');
  return token ? token[1] : null;
}

interface IEmbedRes {
  link: string;
  sources: [];
  tracks: [];
  type: string;
}

interface IStreamData {
  status: string;
  message: string;
  type: string;
  token: string;
  result:
    | {
        Original: {
          label: string;
          file: string;
          url: string;
        };
      }
    | {
        label: string;
        size: number;
        url: string;
      }[];
}

interface ISubtitles {
  url: string;
  lang: string;
}

async function fetchStream(sourceId: string, captchaToken: string) {
  const embedRes = await proxiedFetch<IEmbedRes>(
    `${twoEmbedBase}/ajax/embed/play?id=${sourceId}&_token=${captchaToken}`,
    {
      headers: {
        Referer: twoEmbedBase,
      },
    }
  );

  // Link format: https://rabbitstream.net/embed-4/{data-id}?z=
  const rabbitStreamUrl = new URL(embedRes.link);

  const dataPath = rabbitStreamUrl.pathname.split("/");
  const dataId = dataPath[dataPath.length - 1];

  // https://rabbitstream.net/embed/m-download/{data-id}
  const download = await proxiedFetch<any>(
    `${rabbitStreamUrl.origin}/embed/m-download/${dataId}`,
    {
      headers: {
        referer: twoEmbedBase,
      },
    }
  );

  const downloadPage = new DOMParser().parseFromString(download, "text/html");

  const streamlareEl = Array.from(
    downloadPage.querySelectorAll(".dls-brand")
  ).find((el) => el.textContent?.trim() === "Streamlare");
  if (!streamlareEl) throw new Error("Unable to find streamlare element");

  const streamlareUrl =
    streamlareEl.nextElementSibling?.querySelector("a")?.href;
  if (!streamlareUrl) throw new Error("Unable to parse streamlare url");

  const subtitles: ISubtitles[] = [];
  const subtitlesDropdown = downloadPage.querySelectorAll(
    "#user_menu .dropdown-item"
  );
  subtitlesDropdown.forEach((item) => {
    const url = item.getAttribute("href");
    const lang = item.textContent?.trim().replace("Download", "").trim();
    if (url && lang) subtitles.push({ url, lang });
  });

  const streamlare = await proxiedFetch<any>(streamlareUrl);

  const streamlarePage = new DOMParser().parseFromString(
    streamlare,
    "text/html"
  );

  const csrfToken = streamlarePage
    .querySelector("head > meta:nth-child(3)")
    ?.getAttribute("content");

  if (!csrfToken) throw new Error("Unable to find CSRF token");

  const videoId = streamlareUrl.match("/[ve]/([^?#&/]+)")?.[1];
  if (!videoId) throw new Error("Unable to get streamlare video id");

  const streamRes = await proxiedFetch<IStreamData>(
    `${new URL(streamlareUrl).origin}/api/video/download/get`,
    {
      method: "POST",
      body: JSON.stringify({
        id: videoId,
      }),
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": csrfToken,
      },
    }
  );

  if (streamRes.message !== "OK") throw new Error("Unable to fetch stream");

  const streamData = Array.isArray(streamRes.result)
    ? streamRes.result[0]
    : streamRes.result.Original;
  if (!streamData) throw new Error("Unable to get stream data");

  const followStream = await rawProxiedFetch(streamData.url, {
    method: "HEAD",
    referrer: new URL(streamlareUrl).origin,
  });

  const finalStreamUrl = followStream.headers.get("X-Final-Destination");
  return { url: finalStreamUrl, subtitles };
}

registerProvider({
  id: "2embed",
  displayName: "2Embed",
  rank: 125,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  disabled: true, // Disabled, not working
  async scrape({ media, episode, progress }) {
    let embedUrl = `${twoEmbedBase}/embed/tmdb/movie?id=${media.tmdbId}`;

    if (media.meta.type === MWMediaType.SERIES) {
      const seasonNumber = media.meta.seasonData.number;
      const episodeNumber = media.meta.seasonData.episodes.find(
        (e) => e.id === episode
      )?.number;

      embedUrl = `${twoEmbedBase}/embed/tmdb/tv?id=${media.tmdbId}&s=${seasonNumber}&e=${episodeNumber}`;
    }

    const embed = await proxiedFetch<any>(embedUrl);
    progress(20);

    const embedPage = new DOMParser().parseFromString(embed, "text/html");

    const pageServerItems = Array.from(
      embedPage.querySelectorAll(".item-server")
    );
    const pageStreamItem = pageServerItems.find((item) =>
      item.textContent?.includes("Vidcloud")
    );

    const sourceId = pageStreamItem
      ? pageStreamItem.getAttribute("data-id")
      : null;
    if (!sourceId) throw new Error("Unable to get source id");

    const siteKey = embedPage
      .querySelector("body")
      ?.getAttribute("data-recaptcha-key");
    if (!siteKey) throw new Error("Unable to get site key");

    const captchaToken = await fetchCaptchaToken(siteKey);
    if (!captchaToken) throw new Error("Unable to fetch captcha token");
    progress(35);

    const stream = await fetchStream(sourceId, captchaToken);
    if (!stream.url) throw new Error("Unable to find stream url");

    return {
      embeds: [],
      stream: {
        streamUrl: stream.url,
        quality: MWStreamQuality.QUNKNOWN,
        type: MWStreamType.MP4,
        captions: stream.subtitles.map((sub) => {
          return {
            langIso: sub.lang,
            url: `https://cc.2cdns.com${new URL(sub.url).pathname}`,
            type: MWCaptionType.VTT,
          };
        }),
      },
    };
  },
});
