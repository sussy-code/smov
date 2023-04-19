import { proxiedFetch } from "../helpers/fetch";
import { registerProvider } from "../helpers/register";
import { MWStreamQuality, MWStreamType } from "../helpers/streams";
import { MWMediaType } from "../metadata/types";

const hdwatchedBase = "https://www.hdwatched.xyz";

const qualityMap: Record<number, MWStreamQuality> = {
  360: MWStreamQuality.Q360P,
  540: MWStreamQuality.Q540P,
  480: MWStreamQuality.Q480P,
  720: MWStreamQuality.Q720P,
  1080: MWStreamQuality.Q1080P,
};

interface MovieSearchList {
  title: string;
  id: string;
  year: number;
}

registerProvider({
  id: "hdwatched",
  displayName: "HDwatched",
  rank: 50,
  type: [MWMediaType.MOVIE],
  async scrape({ media, progress }) {
    if (!this.type.includes(media.meta.type)) {
      throw new Error("Unsupported type");
    }

    progress(20);

    const search = await proxiedFetch<any>(`/search/${media.imdbId}`, {
      baseURL: hdwatchedBase,
    });

    const searchPage = new DOMParser().parseFromString(search, "text/html");
    const movieElements = searchPage.querySelectorAll("div.i-container");

    const movieSearchList: MovieSearchList[] = [];
    movieElements.forEach((movieElement) => {
      const href = movieElement.querySelector("a")?.getAttribute("href") || "";
      const title =
        movieElement?.querySelector("span.content-title")?.textContent || "";
      const year =
        parseInt(
          movieElement
            ?.querySelector("div.duration")
            ?.textContent?.trim()
            ?.split(" ")
            ?.pop() || "",
          10
        ) || 0;

      movieSearchList.push({
        title,
        year,
        id: href.split("/")[2], // Format: /free/{id}}/{movie-slug} | Example: /free/18804/iron-man-231
      });
    });

    progress(50);

    const targetMovie = movieSearchList.find(
      (movie) => movie.year === (media.meta.year ? +media.meta.year : 0) // Compare year to make the search more robust
    );

    if (!targetMovie) {
      throw new Error("Could not find stream");
    }

    const stream = await proxiedFetch<any>(`/embed/${targetMovie.id}`, {
      baseURL: hdwatchedBase,
    });

    progress(80);

    const embedPage = new DOMParser().parseFromString(stream, "text/html");
    const source = embedPage.querySelector("#vjsplayer > source");
    if (!source) {
      throw new Error("Could not find stream");
    }

    const streamSrc = source.getAttribute("src");
    const streamRes = source.getAttribute("res");

    if (!streamSrc) {
      throw new Error("Could not find stream");
    }

    return {
      embeds: [],
      stream: {
        streamUrl: streamSrc,
        quality:
          streamRes && typeof +streamRes === "number"
            ? qualityMap[+streamRes]
            : MWStreamQuality.QUNKNOWN,
        type: MWStreamType.MP4,
        captions: [],
      },
    };
  },
});
