import { proxiedFetch } from "@/backend/helpers/fetch";
import { MWMediaMeta } from "@/backend/metadata/types/mw";
import { flixHqBase } from "@/backend/providers/flixhq/common";
import { compareTitle } from "@/utils/titleMatch";

export async function getFlixhqId(meta: MWMediaMeta): Promise<string | null> {
  const searchResults = await proxiedFetch<string>(
    `/search/${meta.title.replaceAll(/[^a-z0-9A-Z]/g, "-")}`,
    {
      baseURL: flixHqBase,
    }
  );

  const doc = new DOMParser().parseFromString(searchResults, "text/html");
  const items = [...doc.querySelectorAll(".film_list-wrap > div.flw-item")].map(
    (el) => {
      const id = el
        .querySelector("div.film-poster > a")
        ?.getAttribute("href")
        ?.slice(1);
      const title = el
        .querySelector("div.film-detail > h2 > a")
        ?.getAttribute("title");
      const year = el.querySelector(
        "div.film-detail > div.fd-infor > span:nth-child(1)"
      )?.textContent;

      if (!id || !title || !year) return null;
      return {
        id,
        title,
        year,
      };
    }
  );

  const matchingItem = items.find(
    (v) => v && compareTitle(meta.title, v.title) && meta.year === v.year
  );

  if (!matchingItem) return null;
  return matchingItem.id;
}
