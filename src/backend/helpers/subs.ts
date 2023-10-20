import { proxiedFetch } from "@/backend/helpers/fetch";
import { testSubData } from "@/backend/helpers/testsub";
import { PlayerMeta } from "@/stores/player/slices/source";
import { normalizeTitle } from "@/utils/normalizeTitle";

interface SuggestResult {
  name: string;
  year: string;
  id: number;
  kind: "tv" | "movie";
}

export interface Subtitle {
  id: string;
  language: string;
}

const metaTypeToOpenSubs = {
  tv: "show",
  movie: "movie",
} as const;

export async function getOpenSubsId(meta: PlayerMeta): Promise<string | null> {
  const req = await proxiedFetch<SuggestResult[]>(
    `https://www.opensubtitles.org/libs/suggest.php`,
    {
      method: "GET",
      headers: {
        "Alt-Used": "www.opensubtitles.org",
        "X-Referer": "https://www.opensubtitles.org/en/search/subs",
      },
      query: {
        format: "json",
        MovieName: meta.title,
      },
    }
  );
  const foundMatch = req.find((v) => {
    const type = metaTypeToOpenSubs[v.kind];
    if (type !== meta.type) return false;
    if (+v.year !== meta.releaseYear) return false;
    return normalizeTitle(v.name) === normalizeTitle(meta.title);
  });
  if (!foundMatch) return null;
  return foundMatch.id.toString();
}

export async function getHighestRatedSubs(id: string): Promise<Subtitle[]> {
  // TODO support episodes
  const document = await proxiedFetch<string>(
    `https://www.opensubtitles.org/en/search/sublanguageid-all/idmovie-${encodeURIComponent(
      id
    )}/sort-6/asc-0`
  );
  const dom = new DOMParser().parseFromString(document, "text/html");
  const table = dom.querySelector("#search_results > tbody");
  if (!table) throw new Error("No result table found");
  const results = [...table.querySelectorAll("tr[id^='name']")].map((v) => {
    const subId = v.id.substring(4); // remove "name" from "name<ID>"
    const languageFlag = v.children[1].querySelector("div[class*='flag']");
    if (!languageFlag) return null;
    const languageFlagClasses = languageFlag.classList.toString().split(" ");
    const languageCode = languageFlagClasses.filter(
      (cssClass) => cssClass === "flag"
    )[0];

    return {
      id: subId,
      language: languageCode,
    };
  });

  const languages: string[] = [];
  const output: Subtitle[] = [];
  results.forEach((v) => {
    if (!v) return;
    if (languages.includes(v.language)) return; // no duplicate languages
    output.push(v);
    languages.push(v.language);
  });

  return output;
}

export async function downloadSrt(_subId: string): Promise<string> {
  // TODO download, unzip and return srt data
  return testSubData.srtData;
}

/**
 * None of this works, CF protected endpoints :(
 */
