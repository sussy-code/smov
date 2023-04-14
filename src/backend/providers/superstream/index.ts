import { registerProvider } from "@/backend/helpers/register";
import { MWMediaType } from "@/backend/metadata/types";

import { customAlphabet } from "nanoid";
import CryptoJS from "crypto-js";
import { proxiedFetch } from "@/backend/helpers/fetch";
import {
  MWCaption,
  MWCaptionType,
  MWStreamQuality,
  MWStreamType,
} from "@/backend/helpers/streams";
import { compareTitle } from "@/utils/titleMatch";

const nanoid = customAlphabet("0123456789abcdef", 32);

const qualityMap = {
  "360p": MWStreamQuality.Q360P,
  "480p": MWStreamQuality.Q480P,
  "720p": MWStreamQuality.Q720P,
  "1080p": MWStreamQuality.Q1080P,
};
type QualityInMap = keyof typeof qualityMap;

// CONSTANTS, read below (taken from og)
// We do not want content scanners to notice this scraping going on so we've hidden all constants
// The source has its origins in China so I added some extra security with banned words
// Mayhaps a tiny bit unethical, but this source is just too good :)
// If you are copying this code please use precautions so they do not change their api.
const iv = atob("d0VpcGhUbiE=");
const key = atob("MTIzZDZjZWRmNjI2ZHk1NDIzM2FhMXc2");
const apiUrls = [
  atob("aHR0cHM6Ly9zaG93Ym94LnNoZWd1Lm5ldC9hcGkvYXBpX2NsaWVudC9pbmRleC8="),
  atob("aHR0cHM6Ly9tYnBhcGkuc2hlZ3UubmV0L2FwaS9hcGlfY2xpZW50L2luZGV4Lw=="),
];
const appKey = atob("bW92aWVib3g=");
const appId = atob("Y29tLnRkby5zaG93Ym94");

// cryptography stuff
const crypto = {
  encrypt(str: string) {
    return CryptoJS.TripleDES.encrypt(str, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
    }).toString();
  },
  getVerify(str: string, str2: string, str3: string) {
    if (str) {
      return CryptoJS.MD5(
        CryptoJS.MD5(str2).toString() + str3 + str
      ).toString();
    }
    return null;
  },
};

// get expire time
const expiry = () => Math.floor(Date.now() / 1000 + 60 * 60 * 12);

// sending requests
const get = (data: object, altApi = false) => {
  const defaultData = {
    childmode: "0",
    app_version: "11.5",
    appid: appId,
    lang: "en",
    expired_date: `${expiry()}`,
    platform: "android",
    channel: "Website",
  };
  const encryptedData = crypto.encrypt(
    JSON.stringify({
      ...defaultData,
      ...data,
    })
  );
  const appKeyHash = CryptoJS.MD5(appKey).toString();
  const verify = crypto.getVerify(encryptedData, appKey, key);
  const body = JSON.stringify({
    app_key: appKeyHash,
    verify,
    encrypt_data: encryptedData,
  });
  const b64Body = btoa(body);

  const formatted = new URLSearchParams();
  formatted.append("data", b64Body);
  formatted.append("appid", "27");
  formatted.append("platform", "android");
  formatted.append("version", "129");
  formatted.append("medium", "Website");

  const requestUrl = altApi ? apiUrls[1] : apiUrls[0];
  return proxiedFetch<any>(requestUrl, {
    method: "POST",
    parseResponse: JSON.parse,
    headers: {
      Platform: "android",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `${formatted.toString()}&token${nanoid()}`,
  });
};

// Find best resolution
const getBestQuality = (list: any[]) => {
  return (
    list.find((quality: any) => quality.quality === "1080p" && quality.path) ??
    list.find((quality: any) => quality.quality === "720p" && quality.path) ??
    list.find((quality: any) => quality.quality === "480p" && quality.path) ??
    list.find((quality: any) => quality.quality === "360p" && quality.path)
  );
};

registerProvider({
  id: "superstream",
  displayName: "Superstream",
  rank: 200,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, episode, progress }) {
    // Find Superstream ID for show
    const searchQuery = {
      module: "Search3",
      page: "1",
      type: "all",
      keyword: media.meta.title,
      pagelimit: "20",
    };
    const searchRes = (await get(searchQuery, true)).data;
    progress(33);

    const superstreamEntry = searchRes.find(
      (res: any) =>
        compareTitle(res.title, media.meta.title) &&
        res.year === Number(media.meta.year)
    );

    if (!superstreamEntry) throw new Error("No entry found on SuperStream");
    const superstreamId = superstreamEntry.id;

    // Movie logic
    if (media.meta.type === MWMediaType.MOVIE) {
      const apiQuery = {
        uid: "",
        module: "Movie_downloadurl_v3",
        mid: superstreamId,
        oss: "1",
        group: "",
      };

      const mediaRes = (await get(apiQuery)).data;
      progress(50);

      const hdQuality = getBestQuality(mediaRes.list);

      if (!hdQuality) throw new Error("No quality could be found.");

      const subtitleApiQuery = {
        fid: hdQuality.fid,
        uid: "",
        module: "Movie_srt_list_v2",
        mid: superstreamId,
      };

      const subtitleRes = (await get(subtitleApiQuery)).data;

      const mappedCaptions = subtitleRes.list.map(
        (subtitle: any): MWCaption => {
          return {
            needsProxy: true,
            langIso: subtitle.language,
            url: subtitle.subtitles[0].file_path,
            type: MWCaptionType.SRT,
          };
        }
      );

      return {
        embeds: [],
        stream: {
          streamUrl: hdQuality.path,
          quality: qualityMap[hdQuality.quality as QualityInMap],
          type: MWStreamType.MP4,
          captions: mappedCaptions,
        },
      };
    }

    if (media.meta.type !== MWMediaType.SERIES)
      throw new Error("Unsupported type");

    // Fetch requested episode
    const apiQuery = {
      uid: "",
      module: "TV_downloadurl_v3",
      tid: superstreamId,
      season: media.meta.seasonData.number.toString(),
      episode: (
        media.meta.seasonData.episodes.find(
          (episodeInfo) => episodeInfo.id === episode
        )?.number ?? 1
      ).toString(),
      oss: "1",
      group: "",
    };

    const mediaRes = (await get(apiQuery)).data;
    progress(66);

    const hdQuality = getBestQuality(mediaRes.list);

    if (!hdQuality) throw new Error("No quality could be found.");

    const subtitleApiQuery = {
      fid: hdQuality.fid,
      uid: "",
      module: "TV_srt_list_v2",
      episode:
        media.meta.seasonData.episodes.find(
          (episodeInfo) => episodeInfo.id === episode
        )?.number ?? 1,
      tid: superstreamId,
      season: media.meta.seasonData.number.toString(),
    };

    const subtitleRes = (await get(subtitleApiQuery)).data;

    const mappedCaptions = subtitleRes.list.map(
      (subtitle: any): MWCaption | null => {
        const sub = subtitle;
        sub.subtitles = subtitle.subtitles.filter((subFile: any) => {
          const extension = subFile.file_path.slice(-3);
          return [MWCaptionType.SRT, MWCaptionType.VTT].includes(extension);
        });
        return {
          needsProxy: true,
          langIso: subtitle.language,
          url: sub.subtitles[0].file_path,
          type: MWCaptionType.SRT,
        };
      }
    );
    return {
      embeds: [],
      stream: {
        quality: qualityMap[
          hdQuality.quality as QualityInMap
        ] as MWStreamQuality,
        streamUrl: hdQuality.path,
        type: MWStreamType.MP4,
        captions: mappedCaptions,
      },
    };
  },
});
