import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";
import { MWMediaType } from "../metadata/types/mw";

const sflixBase = "https://sflix.video";

registerProvider({
  id: "sflix",
  displayName: "Sflix",
  rank: 50,
  disabled: true, // domain dead
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],
  async scrape({ media, episode, progress }) {
    let searchQuery = `${media.meta.title} `;

    if (media.meta.type === MWMediaType.MOVIE)
      searchQuery += media.meta.year ?? "";

    if (media.meta.type === MWMediaType.SERIES)
      searchQuery += `S${String(media.meta.seasonData.number).padStart(
        2,
        "0"
      )}`;

    const search = await proxiedFetch<any>(
      `/?s=${encodeURIComponent(searchQuery)}`,
      {
        baseURL: sflixBase,
      }
    );
    const searchPage = new DOMParser().parseFromString(search, "text/html");

    const moviePageUrl = searchPage
      .querySelector(".movies-list .ml-item:first-child a")
      ?.getAttribute("href");
    if (!moviePageUrl) throw new Error("Movie does not exist");

    progress(25);

    const movie = await proxiedFetch<any>(moviePageUrl);
    const moviePage = new DOMParser().parseFromString(movie, "text/html");

    progress(45);

    let outerEmbedSrc = null;
    if (media.meta.type === MWMediaType.MOVIE) {
      outerEmbedSrc = moviePage
        .querySelector("iframe")
        ?.getAttribute("data-lazy-src");
    } else if (media.meta.type === MWMediaType.SERIES) {
      const series = Array.from(moviePage.querySelectorAll(".desc p a")).map(
        (a) => ({
          title: a.getAttribute("title"),
          link: a.getAttribute("href"),
        })
      );

      const episodeNumber = media.meta.seasonData.episodes.find(
        (e) => e.id === episode
      )?.number;

      const targetSeries = series.find((s) =>
        s.title?.endsWith(String(episodeNumber).padStart(2, "0"))
      );
      if (!targetSeries) throw new Error("Episode does not exist");

      outerEmbedSrc = targetSeries.link;
    }
    if (!outerEmbedSrc) throw new Error("Outer embed source not found");

    progress(65);

    const outerEmbed = await proxiedFetch<any>(outerEmbedSrc);
    const outerEmbedPage = new DOMParser().parseFromString(
      outerEmbed,
      "text/html"
    );

    const embedSrc = outerEmbedPage
      .querySelector("iframe")
      ?.getAttribute("src");
    if (!embedSrc) throw new Error("Embed source not found");

    const embed = await proxiedFetch<string>(embedSrc);

    const streamUrl = embed.match(/file\s*:\s*"([^"]+\.mp4)"/)?.[1];
    if (!streamUrl) throw new Error("Unable to get stream");

    return {
      embeds: [],
      stream: {
        streamUrl,
        quality: MWStreamQuality.Q1080P,
        type: MWStreamType.MP4,
        captions: [],
      },
    };
  },
});
