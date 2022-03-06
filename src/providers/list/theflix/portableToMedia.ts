import { CORS_PROXY_URL } from "mw_constants";
import { MWMediaType, MWPortableMedia } from "providers/types";

const getTheFlixUrl = (media: MWPortableMedia, params?: URLSearchParams) => {
  if (media.mediaType === MWMediaType.MOVIE) {
    return `https://theflix.to/movie/${media.mediaId}?${params}`;
  }
  if (media.mediaType === MWMediaType.SERIES) {
    return `https://theflix.to/tv-show/${media.mediaId}/season-${media.season}/episode-${media.episode}`;
  }

  return "";
};

export async function getDataFromPortableSearch(
  media: MWPortableMedia
): Promise<any> {
  const params = new URLSearchParams();
  params.append("movieInfo", media.mediaId);

  const res = await fetch(CORS_PROXY_URL + getTheFlixUrl(media, params)).then(
    (d) => d.text()
  );

  const node: Element = Array.from(
    new DOMParser()
      .parseFromString(res, "text/html")
      .querySelectorAll(`script[id="__NEXT_DATA__"]`)
  )[0];

  if (media.mediaType === MWMediaType.MOVIE) {
    return JSON.parse(node.innerHTML).props.pageProps.movie;
  }
  // must be series here
  return JSON.parse(node.innerHTML).props.pageProps.selectedTv;
}
