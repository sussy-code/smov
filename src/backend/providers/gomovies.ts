import { MWEmbedType } from "../helpers/embed";
import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWMediaType } from "../metadata/types/mw";

const gomoviesBase = "https://gomovies.sx";

registerProvider({
  id: "gomovies",
  displayName: "GOmovies",
  rank: 200,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, episode }) {
    const search = await proxiedFetch<any>("/ajax/search", {
      baseURL: gomoviesBase,
      method: "POST",
      body: JSON.stringify({
        keyword: media.meta.title,
      }),
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const searchPage = new DOMParser().parseFromString(search, "text/html");
    const mediaElements = searchPage.querySelectorAll("a.nav-item");

    const mediaData = Array.from(mediaElements).map((movieEl) => {
      const name = movieEl?.querySelector("h3.film-name")?.textContent;
      const year = movieEl?.querySelector(
        "div.film-infor span:first-of-type"
      )?.textContent;
      const path = movieEl.getAttribute("href");
      return { name, year, path };
    });

    const targetMedia = mediaData.find(
      (m) =>
        m.name === media.meta.title &&
        (media.meta.type === MWMediaType.MOVIE
          ? m.year === media.meta.year
          : true)
    );
    if (!targetMedia?.path) throw new Error("Media not found");

    // Example movie path: /movie/watch-{slug}-{id}
    // Example series path: /tv/watch-{slug}-{id}
    let mediaId = targetMedia.path.split("-").pop()?.replace("/", "");

    let sources = null;
    if (media.meta.type === MWMediaType.SERIES) {
      const seasons = await proxiedFetch<any>(
        `/ajax/v2/tv/seasons/${mediaId}`,
        {
          baseURL: gomoviesBase,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      const seasonsEl = new DOMParser()
        .parseFromString(seasons, "text/html")
        .querySelectorAll(".ss-item");

      const seasonsData = [...seasonsEl].map((season) => ({
        number: season.innerHTML.replace("Season ", ""),
        dataId: season.getAttribute("data-id"),
      }));

      const seasonNumber = media.meta.seasonData.number;
      const targetSeason = seasonsData.find(
        (season) => +season.number === seasonNumber
      );
      if (!targetSeason) throw new Error("Season not found");

      const episodes = await proxiedFetch<any>(
        `/ajax/v2/season/episodes/${targetSeason.dataId}`,
        {
          baseURL: gomoviesBase,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      const episodesEl = new DOMParser()
        .parseFromString(episodes, "text/html")
        .querySelectorAll(".eps-item");

      const episodesData = Array.from(episodesEl).map((ep) => ({
        dataId: ep.getAttribute("data-id"),
        number: ep
          .querySelector("strong")
          ?.textContent?.replace("Eps", "")
          .replace(":", "")
          .trim(),
      }));

      const episodeNumber = media.meta.seasonData.episodes.find(
        (e) => e.id === episode
      )?.number;

      const targetEpisode = episodesData.find((ep) =>
        ep.number ? +ep.number === episodeNumber : false
      );

      if (!targetEpisode?.dataId) throw new Error("Episode not found");

      mediaId = targetEpisode.dataId;

      sources = await proxiedFetch<any>(`/ajax/v2/episode/servers/${mediaId}`, {
        baseURL: gomoviesBase,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    } else {
      sources = await proxiedFetch<any>(`/ajax/movie/episodes/${mediaId}`, {
        baseURL: gomoviesBase,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    }

    const upcloud = new DOMParser()
      .parseFromString(sources, "text/html")
      .querySelector('a[title*="upcloud" i]');

    const upcloudDataId =
      upcloud?.getAttribute("data-id") ?? upcloud?.getAttribute("data-linkid");

    if (!upcloudDataId) throw new Error("Upcloud source not available");

    const upcloudSource = await proxiedFetch<{
      type: "iframe" | string;
      link: string;
      sources: [];
      title: string;
      tracks: [];
    }>(`/ajax/sources/${upcloudDataId}`, {
      baseURL: gomoviesBase,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!upcloudSource.link || upcloudSource.type !== "iframe")
      throw new Error("No upcloud stream found");

    return {
      embeds: [
        {
          type: MWEmbedType.UPCLOUD,
          url: upcloudSource.link,
        },
      ],
    };
  },
});
