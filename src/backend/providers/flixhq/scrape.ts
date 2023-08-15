import { proxiedFetch } from "@/backend/helpers/fetch";
import { flixHqBase } from "@/backend/providers/flixhq/common";

export async function getFlixhqSources(id: string) {
  const type = id.split("/")[0];
  const episodeParts = id.split("-");
  const episodeId = episodeParts[episodeParts.length - 1];

  const data = await proxiedFetch<string>(
    `/ajax/${type}/episodes/${episodeId}`,
    {
      baseURL: flixHqBase,
    }
  );
  const doc = new DOMParser().parseFromString(data, "text/html");

  const sourceLinks = [...doc.querySelectorAll(".nav-item > a")].map((el) => {
    const embedTitle = el.getAttribute("title");
    const linkId = el.getAttribute("data-linkid");
    if (!embedTitle || !linkId) throw new Error("invalid sources");
    return {
      embed: embedTitle,
      episodeId: linkId,
    };
  });

  return sourceLinks;
}

export async function getFlixhqSourceDetails(
  sourceId: string
): Promise<string> {
  const jsonData = await proxiedFetch<Record<string, any>>(
    `/ajax/sources/${sourceId}`,
    {
      baseURL: flixHqBase,
    }
  );

  return jsonData.link;
}
