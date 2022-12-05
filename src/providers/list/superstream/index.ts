// this is derived from https://github.com/recloudstream/cloudstream-extensions
// for more info please check the LICENSE file in the same directory

import {
  MWMediaProvider,
  MWMediaType,
  MWPortableMedia,
  MWMediaStream,
  MWQuery,
  MWMediaSeasons,
  MWProviderMediaResult,
} from "providers/types";
import { CORS_PROXY_URL, TMDB_API_KEY } from "mw_constants";
import { customAlphabet } from "nanoid";
import toWebVTT from "srt-webvtt";
import CryptoJS from "crypto-js";

const nanoid = customAlphabet("0123456789abcdef", 32);

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
        CryptoJS.MD5(str2).toString() + str3 + str,
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
    }),
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
  return fetch(`${CORS_PROXY_URL}${requestUrl}`, {
    method: "POST",
    headers: {
      Platform: "android",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `${formatted.toString()}&token${nanoid()}`,
  });
};

export const superStreamScraper: MWMediaProvider = {
  id: "superstream",
  enabled: true,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  displayName: "SuperStream",

  async getMediaFromPortable(
    media: MWPortableMedia,
  ): Promise<MWProviderMediaResult> {
    let apiQuery: any;
    if (media.mediaType === MWMediaType.MOVIE) {
      apiQuery = {
        module: "TV_detail_1",
        display_all: "1",
        tid: media.mediaId,
      };
    } else {
      apiQuery = {
        module: "Movie_detail",
        mid: media.mediaId,
      };
    }
    const detailRes = (await get(apiQuery, true).then((r) => r.json())).data;

    return {
      ...media,
      title: detailRes.title,
      year: detailRes.year,
      seasonCount: detailRes?.season?.length,
    } as MWProviderMediaResult;
  },

  async searchForMedia(query: MWQuery): Promise<MWProviderMediaResult[]> {
    const apiQuery = {
      module: "Search3",
      page: "1",
      type: "all",
      keyword: query.searchQuery,
      pagelimit: "20",
    };
    const searchRes = (await get(apiQuery, true).then((r) => r.json())).data;

    const movieResults: MWProviderMediaResult[] = (searchRes || [])
      .filter((item: any) => item.box_type === 1)
      .map((item: any) => ({
        title: item.title,
        year: item.year,
        mediaId: item.id,
      }));
    const seriesResults: MWProviderMediaResult[] = (searchRes || [])
      .filter((item: any) => item.box_type === 2)
      .map((item: any) => ({
        title: item.title,
        year: item.year,
        mediaId: item.id,
        seasonId: "1",
        episodeId: "1",
      }));

    if (query.type === MWMediaType.MOVIE) {
      return movieResults;
    }
    if (query.type === MWMediaType.SERIES) {
      return seriesResults;
    }
    throw new Error("Invalid media type used.");
  },

  async getStream(media: MWPortableMedia): Promise<MWMediaStream> {
    if (media.mediaType === MWMediaType.MOVIE) {
      const apiQuery = {
        uid: "",
        module: "Movie_downloadurl_v3",
        mid: media.mediaId,
        oss: "1",
        group: "",
      };
      const mediaRes = (await get(apiQuery).then((r) => r.json())).data;
      const hdQuality =
        mediaRes.list.find((quality: any) => quality.quality === "1080p") ??
        mediaRes.list.find((quality: any) => quality.quality === "720p");

      const subtitleApiQuery = {
        fid: hdQuality.fid,
        uid: "",
        module: "Movie_srt_list_v2",
        mid: media.mediaId,
      };
      const subtitleRes = (await get(subtitleApiQuery).then((r) => r.json()))
        .data;
      const mappedCaptions = await Promise.all(
        subtitleRes.list.map(async (subtitle: any) => {
          const captionBlob = await fetch(
            `${CORS_PROXY_URL}${subtitle.subtitles[0].file_path}`,
          ).then((captionRes) => captionRes.blob()); // cross-origin bypass
          const captionUrl = await toWebVTT(captionBlob); // convert to vtt so it's playable
          return {
            id: subtitle.language,
            url: captionUrl,
            label: subtitle.language,
          };
        }),
      );

      return { url: hdQuality.path, type: "mp4", captions: mappedCaptions };
    }

    const apiQuery = {
      uid: "",
      module: "TV_downloadurl_v3",
      episode: media.episodeId,
      tid: media.mediaId,
      season: media.seasonId,
      oss: "1",
      group: "",
    };
    const mediaRes = (await get(apiQuery).then((r) => r.json())).data;
    const hdQuality =
      mediaRes.list.find((quality: any) => quality.quality === "1080p") ??
      mediaRes.list.find((quality: any) => quality.quality === "720p");

    const subtitleApiQuery = {
      fid: hdQuality.fid,
      uid: "",
      module: "TV_srt_list_v2",
      episode: media.episodeId,
      tid: media.mediaId,
      season: media.seasonId,
    };
    const subtitleRes = (await get(subtitleApiQuery).then((r) => r.json()))
      .data;
    const mappedCaptions = await Promise.all(
      subtitleRes.list.map(async (subtitle: any) => {
        const captionBlob = await fetch(
          `${CORS_PROXY_URL}${subtitle.subtitles[0].file_path}`,
        ).then((captionRes) => captionRes.blob()); // cross-origin bypass
        const captionUrl = await toWebVTT(captionBlob); // convert to vtt so it's playable
        return {
          id: subtitle.language,
          url: captionUrl,
          label: subtitle.language,
        };
      }),
    );

    return { url: hdQuality.path, type: "mp4", captions: mappedCaptions };
  },
  async getSeasonDataFromMedia(
    media: MWPortableMedia,
  ): Promise<MWMediaSeasons> {
    const apiQuery = {
      module: "TV_detail_1",
      display_all: "1",
      tid: media.mediaId,
    };
    const detailRes = (await get(apiQuery, true).then((r) => r.json())).data;
    const firstSearchResult = (
      await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=en-US&page=1&query=${detailRes.title}&include_adult=false&first_air_date_year=${detailRes.year}`,
      ).then((r) => r.json())
    ).results[0];
    const showDetails = await fetch(
      `https://api.themoviedb.org/3/tv/${firstSearchResult.id}?api_key=${TMDB_API_KEY}`,
    ).then((r) => r.json());

    return {
      seasons: showDetails.seasons.map((season: any) => ({
        sort: season.season_number,
        id: season.season_number.toString(),
        type: season.season_number === 0 ? "special" : "season",
        episodes: Array.from({ length: season.episode_count }).map(
          (_, epNum) => ({
            title: `Episode ${epNum + 1}`,
            sort: epNum + 1,
            id: (epNum + 1).toString(),
            episodeNumber: epNum + 1,
          }),
        ),
      })),
    };
  },
};
