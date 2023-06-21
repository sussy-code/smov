import { MWEmbed, MWEmbedType } from "@/backend/helpers/embed";

import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWMediaType } from "../metadata/types/mw";

const HOST = "m4ufree.com";
const URL_BASE = `https://${HOST}`;
const URL_SEARCH = `${URL_BASE}/search`;
const URL_AJAX = `${URL_BASE}/ajax`;
const URL_AJAX_TV = `${URL_BASE}/ajaxtv`;

// * Years can be in one of 4 formats:
// * - "startyear" (for movies, EX: 2022)
// * - "startyear-" (for TV series which has not ended, EX: 2022-)
// * - "startyear-endyear" (for TV series which has ended, EX: 2022-2023)
// * - "startyearendyear" (for TV series which has ended, EX: 20222023)
const REGEX_TITLE_AND_YEAR = /(.*) \(?(\d*|\d*-|\d*-\d*)\)?$/;
const REGEX_TYPE = /.*-(movie|tvshow)-online-free-m4ufree\.html/;
const REGEX_COOKIES = /XSRF-TOKEN=(.*?);.*laravel_session=(.*?);/;
const REGEX_SEASON_EPISODE = /S(\d*)-E(\d*)/;

function toDom(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

registerProvider({
  id: "m4ufree",
  displayName: "m4ufree",
  rank: -1,
  disabled: true, // Disables because the redirector URLs it returns will throw 404 / 403 depending on if you view it in the browser or fetch it respectively. It just does not work.
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, type, episode: episodeId, season: seasonId }) {
    const season =
      media.meta.seasons?.find((s) => s.id === seasonId)?.number || 1;
    const episode =
      media.meta.type === MWMediaType.SERIES
        ? media.meta.seasonData.episodes.find((ep) => ep.id === episodeId)
            ?.number || 1
        : undefined;

    const embeds: MWEmbed[] = [];

    /*
, {
      responseType: "text" as any,
    }
    */
    const responseText = await proxiedFetch<string>(
      `${URL_SEARCH}/${encodeURIComponent(media.meta.title)}.html`
    );
    let dom = toDom(responseText);

    const searchResults = [...dom.querySelectorAll(".item")]
      .map((element) => {
        const tooltipText = element.querySelector(".tiptitle p")?.innerHTML;
        if (!tooltipText) return;

        let regexResult = REGEX_TITLE_AND_YEAR.exec(tooltipText);

        if (!regexResult || !regexResult[1] || !regexResult[2]) {
          return;
        }

        const title = regexResult[1];
        const year = Number(regexResult[2].slice(0, 4)); // * Some media stores the start AND end year. Only need start year
        const a = element.querySelector("a");
        if (!a) return;
        const href = a.href;

        regexResult = REGEX_TYPE.exec(href);

        if (!regexResult || !regexResult[1]) {
          return;
        }

        let scraperDeterminedType = regexResult[1];

        scraperDeterminedType =
          scraperDeterminedType === "tvshow" ? "show" : "movie"; // * Map to Trakt type

        return { type: scraperDeterminedType, title, year, href };
      })
      .filter((item) => item);

    const mediaInResults = searchResults.find(
      (item) =>
        item &&
        item.title === media.meta.title &&
        item.year.toString() === media.meta.year
    );

    if (!mediaInResults) {
      // * Nothing found
      return {
        embeds,
      };
    }

    let cookies: string | null = "";
    const responseTextFromMedia = await proxiedFetch<string>(
      mediaInResults.href,
      {
        onResponse(context) {
          cookies = context.response.headers.get("X-Set-Cookie");
        },
      }
    );
    dom = toDom(responseTextFromMedia);

    let regexResult = REGEX_COOKIES.exec(cookies);

    if (!regexResult || !regexResult[1] || !regexResult[2]) {
      // * DO SOMETHING?
      throw new Error("No regexResults, yikesssssss kinda gross idk");
    }

    const cookieHeader = `XSRF-TOKEN=${regexResult[1]}; laravel_session=${regexResult[2]}`;

    const token = dom
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (!token) return { embeds };

    if (type === MWMediaType.SERIES) {
      // * Get the season/episode data
      const episodes = [...dom.querySelectorAll(".episode")]
        .map((element) => {
          regexResult = REGEX_SEASON_EPISODE.exec(element.innerHTML);

          if (!regexResult || !regexResult[1] || !regexResult[2]) {
            return;
          }

          const newEpisode = Number(regexResult[1]);
          const newSeason = Number(regexResult[2]);

          return {
            id: element.getAttribute("idepisode"),
            episode: newEpisode,
            season: newSeason,
          };
        })
        .filter((item) => item);

      const ep = episodes.find(
        (newEp) => newEp && newEp.episode === episode && newEp.season === season
      );
      if (!ep) return { embeds };

      const form = `idepisode=${ep.id}&_token=${token}`;

      const response = await proxiedFetch<string>(URL_AJAX_TV, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Sec-CH-UA":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
          "Sec-CH-UA-Mobile": "?0",
          "Sec-CH-UA-Platform": '"Linux"',
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          "X-Cookie": cookieHeader,
          "X-Origin": URL_BASE,
          "X-Referer": mediaInResults.href,
        },
        body: form,
      });

      dom = toDom(response);
    }

    const servers = [...dom.querySelectorAll(".singlemv")].map((element) =>
      element.getAttribute("data")
    );

    for (const server of servers) {
      const form = `m4u=${server}&_token=${token}`;

      const response = await proxiedFetch<string>(URL_AJAX, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Sec-CH-UA":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
          "Sec-CH-UA-Mobile": "?0",
          "Sec-CH-UA-Platform": '"Linux"',
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          "X-Cookie": cookieHeader,
          "X-Origin": URL_BASE,
          "X-Referer": mediaInResults.href,
        },
        body: form,
      });

      const serverDom = toDom(response);

      const link = serverDom.querySelector("iframe")?.src;

      const getEmbedType = (url: string) => {
        if (url.startsWith("https://streamm4u.club"))
          return MWEmbedType.STREAMM4U;
        if (url.startsWith("https://play.playm4u.xyz"))
          return MWEmbedType.PLAYM4U;
        return null;
      };

      if (!link) continue;

      const embedType = getEmbedType(link);
      if (embedType) {
        embeds.push({
          url: link,
          type: embedType,
        });
      }
    }

    console.log(embeds);
    return {
      embeds,
    };
  },
});
