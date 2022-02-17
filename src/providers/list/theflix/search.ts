import { CORS_PROXY_URL } from "mw_constants";
import { MWMediaType, MWProviderMediaResult, MWQuery } from "providers";

const getTheFlixUrl = (type: "tv-shows" | "movies", params: URLSearchParams) =>
  `https://theflix.to/${type}/trending?${params}`;

export async function searchTheFlix(query: MWQuery): Promise<string> {
  const params = new URLSearchParams();
  params.append("search", query.searchQuery);
  return await fetch(
    CORS_PROXY_URL +
      getTheFlixUrl(
        query.type === MWMediaType.MOVIE ? "movies" : "tv-shows",
        params
      )
  ).then((d) => d.text());
}

export function getDataFromSearch(page: string, limit: number = 10): any[] {
  const node: Element = Array.from(
    new DOMParser()
      .parseFromString(page, "text/html")
      .querySelectorAll(`script[id="__NEXT_DATA__"]`)
  )[0];
  const data = JSON.parse(node.innerHTML);
  return data.props.pageProps.mainList.docs
    .filter((d: any) => d.available)
    .slice(0, limit);
}

export function turnDataIntoMedia(data: any): MWProviderMediaResult {
  return {
    mediaId:
      data.id +
      "-" +
      data.name
        .replace(/[^a-z0-9]+|\s+/gim, " ")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase(),
    title: data.name,
    year: new Date(data.releaseDate).getFullYear().toString(),
  };
}
