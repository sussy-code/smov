import { gql, request } from "graphql-request";
import { unzip } from "unzipit";

import { proxiedFetch } from "@/backend/helpers/fetch";
import { languageMap } from "@/setup/iso6391";
import { PlayerMeta } from "@/stores/player/slices/source";

const GQL_API = "https://gqlos.plus-sub.com";

const subtitleSearchQuery = gql`
  query SubtitleSearch($tmdb_id: String!, $ep: Int, $season: Int) {
    subtitleSearch(
      tmdb_id: $tmdb_id
      language: ""
      episode_number: $ep
      season_number: $season
    ) {
      data {
        attributes {
          language
          subtitle_id
          ai_translated
          auto_translation
          ratings
          votes
          legacy_subtitle_id
        }
        id
      }
    }
  }
`;

interface RawSubtitleSearchItem {
  id: string;
  attributes: {
    language: string;
    ai_translated: boolean | null;
    auto_translation: null | boolean;
    ratings: number;
    votes: number | null;
    legacy_subtitle_id: string | null;
  };
}

export interface SubtitleSearchItem {
  id: string;
  attributes: {
    language: string;
    ai_translated: boolean | null;
    auto_translation: null | boolean;
    ratings: number;
    votes: number | null;
    legacy_subtitle_id: string;
  };
}

interface SubtitleSearchData {
  subtitleSearch: {
    data: RawSubtitleSearchItem[];
  };
}

export async function searchSubtitles(
  meta: PlayerMeta
): Promise<SubtitleSearchItem[]> {
  const data = await request<SubtitleSearchData>({
    document: subtitleSearchQuery,
    url: GQL_API,
    variables: {
      tmdb_id: meta.tmdbId,
      ep: meta.episode?.number,
      season: meta.season?.number,
    },
  });

  const sortedByLanguage: Record<string, RawSubtitleSearchItem[]> = {};
  data.subtitleSearch.data.forEach((v) => {
    if (!sortedByLanguage[v.attributes.language])
      sortedByLanguage[v.attributes.language] = [];
    sortedByLanguage[v.attributes.language].push(v);
  });

  return Object.values(sortedByLanguage).map((langs) => {
    const onlyLegacySubs = langs.filter(
      (v): v is SubtitleSearchItem => !!v.attributes.legacy_subtitle_id
    );
    const sortedByRating = onlyLegacySubs.sort(
      (a, b) =>
        b.attributes.ratings * (b.attributes.votes ?? 0) -
        a.attributes.ratings * (a.attributes.votes ?? 0)
    );
    return sortedByRating[0];
  });
}

export function languageIdToName(langId: string): string | null {
  return languageMap[langId]?.nativeName ?? null;
}

export async function downloadSrt(legacySubId: string): Promise<string> {
  // TODO there is cloudflare protection so this may not always work. what to do about that?
  // TODO also there is ratelimit on the page itself
  // language code is hardcoded here, it does nothing
  const zipFile = await proxiedFetch<ArrayBuffer>(
    `https://dl.opensubtitles.org/en/subtitleserve/sub/${legacySubId}`,
    {
      responseType: "arrayBuffer",
    }
  );

  const { entries } = await unzip(zipFile);
  const srtEntry = Object.values(entries).find((v) => v.name);
  if (!srtEntry) throw new Error("No srt file found in zip");
  const srtData = srtEntry.text();
  return srtData;
}
