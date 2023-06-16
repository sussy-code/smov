import { MWEmbedType } from "../helpers/embed";
import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWMediaType } from "../metadata/types";

const kissasianBase = "https://kissasian.li";

registerProvider({
  id: "kissasian",
  displayName: "KissAsian",
  rank: 130,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, episode, progress }) {
    let seasonNumber = "";
    let episodeNumber = "";

    if (media.meta.type === MWMediaType.SERIES) {
      seasonNumber =
        media.meta.seasonData.number === 1
          ? ""
          : `${media.meta.seasonData.number}`;
      episodeNumber = `${
        media.meta.seasonData.episodes.find((e) => e.id === episode)?.number ??
        ""
      }`;
    }

    const searchForm = new FormData();
    searchForm.append("keyword", `${media.meta.title} ${seasonNumber}`.trim());
    searchForm.append("type", "Drama");

    const search = await proxiedFetch<any>("/Search/SearchSuggest", {
      baseURL: kissasianBase,
      method: "POST",
      body: searchForm,
    });

    const searchPage = new DOMParser().parseFromString(search, "text/html");

    const dramas = Array.from(searchPage.querySelectorAll("a")).map((drama) => {
      return {
        name: drama.textContent,
        url: drama.href,
      };
    });

    const targetDrama =
      dramas.find(
        (d) => d.name?.toLowerCase() === media.meta.title.toLowerCase()
      ) ?? dramas[0];
    if (!targetDrama) throw new Error("Drama not found");

    progress(30);

    const drama = await proxiedFetch<any>(targetDrama.url);

    const dramaPage = new DOMParser().parseFromString(drama, "text/html");

    const episodesEl = dramaPage.querySelectorAll("tbody tr:not(:first-child)");

    const episodes = Array.from(episodesEl)
      .map((ep) => {
        const number = ep
          ?.querySelector("td.episodeSub a")
          ?.textContent?.split("Episode")[1]
          ?.trim();
        const href = ep?.querySelector("td.episodeSub a")?.getAttribute("href");
        return { number, href };
      })
      .filter((e) => !!e.href);

    const targetEpisode =
      media.meta.type === MWMediaType.MOVIE
        ? episodes[0]
        : episodes.find((e) => e.number === `${episodeNumber}`);
    if (!targetEpisode?.href) throw new Error("Episode not found");

    progress(70);

    const watch = await proxiedFetch<any>(`${targetEpisode.href}&s=sb`, {
      baseURL: kissasianBase,
    });

    const watchPage = new DOMParser().parseFromString(watch, "text/html");

    const streamsbUrl = watchPage
      .querySelector("iframe[id=my_video_1]")
      ?.getAttribute("src");
    if (!streamsbUrl) throw new Error("Streamsb embed not found");

    return {
      embeds: [
        {
          type: MWEmbedType.STREAMSB,
          url: streamsbUrl,
        },
      ],
    };
  },
});
