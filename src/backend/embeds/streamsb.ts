import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

import { MWEmbedType } from "@/backend/helpers/embed";
import { proxiedFetch } from "@/backend/helpers/fetch";
import { registerEmbedScraper } from "@/backend/helpers/register";
import {
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "@/backend/helpers/streams";

const qualityOrder = [
  MWStreamQuality.Q1080P,
  MWStreamQuality.Q720P,
  MWStreamQuality.Q480P,
  MWStreamQuality.Q360P,
];

async function fetchCaptchaToken(domain: string, recaptchaKey: string) {
  const domainHash = Base64.stringify(Utf8.parse(domain)).replace(/=/g, ".");

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
    co: domain,
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

registerEmbedScraper({
  id: "streamsb",
  displayName: "StreamSB",
  for: MWEmbedType.STREAMSB,
  rank: 150,
  async getStream({ url, progress }) {
    /* Url variations
    - domain.com/{id}?.html
    - domain.com/{id}
    - domain.com/embed-{id}
    - domain.com/d/{id}
    - domain.com/e/{id}
    - domain.com/e/{id}-embed
    */
    const streamsbUrl = url
      .replace(".html", "")
      .replace("embed-", "")
      .replace("e/", "")
      .replace("d/", "");

    const parsedUrl = new URL(streamsbUrl);
    const base = await proxiedFetch<any>(
      `${parsedUrl.origin}/d${parsedUrl.pathname}`
    );

    progress(20);

    // Parse captions from url
    const captionUrl = parsedUrl.searchParams.get("caption_1");
    const captionLang = parsedUrl.searchParams.get("sub_1");

    const basePage = new DOMParser().parseFromString(base, "text/html");

    const downloadVideoFunctions = basePage.querySelectorAll(
      "[onclick^=download_video]"
    );

    let dlDetails = [];
    for (const func of downloadVideoFunctions) {
      const funcContents = func.getAttribute("onclick");
      const regExpFunc = /download_video\('(.+?)','(.+?)','(.+?)'\)/;
      const matchesFunc = regExpFunc.exec(funcContents ?? "");
      if (matchesFunc !== null) {
        const quality = func.querySelector("span")?.textContent;
        const regExpQuality = /(.+?) \((.+?)\)/;
        const matchesQuality = regExpQuality.exec(quality ?? "");
        if (matchesQuality !== null) {
          dlDetails.push({
            parameters: [matchesFunc[1], matchesFunc[2], matchesFunc[3]],
            quality: {
              label: matchesQuality[1].trim(),
              size: matchesQuality[2],
            },
          });
        }
      }
    }

    dlDetails = dlDetails.sort((a, b) => {
      const aQuality = qualityOrder.indexOf(a.quality.label as MWStreamQuality);
      const bQuality = qualityOrder.indexOf(b.quality.label as MWStreamQuality);
      return aQuality - bQuality;
    });

    progress(40);

    let dls = await Promise.all(
      dlDetails.map(async (dl) => {
        const getDownload = await proxiedFetch<any>(
          `/dl?op=download_orig&id=${dl.parameters[0]}&mode=${dl.parameters[1]}&hash=${dl.parameters[2]}`,
          {
            baseURL: parsedUrl.origin,
          }
        );

        const downloadPage = new DOMParser().parseFromString(
          getDownload,
          "text/html"
        );

        const recaptchaKey = downloadPage
          .querySelector(".g-recaptcha")
          ?.getAttribute("data-sitekey");
        if (!recaptchaKey) throw new Error("Unable to get captcha key");

        const captchaToken = await fetchCaptchaToken(
          parsedUrl.origin,
          recaptchaKey
        );
        if (!captchaToken) throw new Error("Unable to get captcha token");

        const dlForm = new FormData();
        dlForm.append("op", "download_orig");
        dlForm.append("id", dl.parameters[0]);
        dlForm.append("mode", dl.parameters[1]);
        dlForm.append("hash", dl.parameters[2]);
        dlForm.append("g-recaptcha-response", captchaToken);

        const download = await proxiedFetch<any>(
          `/dl?op=download_orig&id=${dl.parameters[0]}&mode=${dl.parameters[1]}&hash=${dl.parameters[2]}`,
          {
            baseURL: parsedUrl.origin,
            method: "POST",
            body: dlForm,
          }
        );

        const dlLink = new DOMParser()
          .parseFromString(download, "text/html")
          .querySelector(".btn.btn-light.btn-lg")
          ?.getAttribute("href");

        return {
          quality: dl.quality.label as MWStreamQuality,
          url: dlLink,
          size: dl.quality.size,
          captions:
            captionUrl && captionLang
              ? [
                  {
                    url: captionUrl,
                    langIso: captionLang,
                    type: MWCaptionType.VTT,
                  },
                ]
              : [],
        };
      })
    );
    dls = dls.filter((d) => !!d.url);

    progress(60);

    // TODO: Quality selection for embed scrapers
    const dl = dls[0];
    if (!dl.url) throw new Error("No stream url found");

    return {
      embedId: MWEmbedType.STREAMSB,
      streamUrl: dl.url,
      quality: dl.quality,
      captions: dl.captions,
      type: MWStreamType.MP4,
    };
  },
});
