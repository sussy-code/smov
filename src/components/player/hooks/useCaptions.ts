import { useCallback } from "react";

import {
  SubtitleSearchItem,
  downloadSrt,
  searchSubtitles,
} from "@/backend/helpers/subs";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";
import { SimpleCache } from "@/utils/cache";

const cacheTimeSec = 24 * 60 * 60; // 24 hours

const downloadCache = new SimpleCache<string, string>();
downloadCache.setCompare((a, b) => a === b);

const searchCache = new SimpleCache<
  { tmdbId: string; ep?: string; season?: string },
  SubtitleSearchItem[]
>();
searchCache.setCompare(
  (a, b) => a.tmdbId === b.tmdbId && a.ep === b.ep && a.season === b.season
);

export function useCaptions() {
  const setLanguage = useSubtitleStore((s) => s.setLanguage);
  const enabled = useSubtitleStore((s) => s.enabled);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const lastSelectedLanguage = useSubtitleStore((s) => s.lastSelectedLanguage);
  const meta = usePlayerStore((s) => s.meta);

  const download = useCallback(
    async (subtitleId: string, language: string) => {
      let srtData = downloadCache.get(subtitleId);
      if (!srtData) {
        srtData = await downloadSrt(subtitleId);
        downloadCache.set(subtitleId, srtData, cacheTimeSec);
      }
      setCaption({
        language,
        srtData,
        url: "", // TODO remove url
      });
      setLanguage(language);
    },
    [setCaption, setLanguage]
  );

  const search = useCallback(async () => {
    if (!meta) throw new Error("No meta");
    const key = {
      tmdbId: meta.tmdbId,
      ep: meta.episode?.tmdbId,
      season: meta.season?.tmdbId,
    };
    const results = searchCache.get(key);
    if (results) return [...results];

    const freshResults = await searchSubtitles(meta);
    searchCache.set(key, [...freshResults], cacheTimeSec);
    return freshResults;
  }, [meta]);

  const disable = useCallback(async () => {
    setCaption(null);
    setLanguage(null);
  }, [setCaption, setLanguage]);

  const downloadLastUsed = useCallback(async () => {
    const language = lastSelectedLanguage ?? "en";
    const searchResult = await search();
    const languageResult = searchResult.find(
      (v) => v.attributes.language === language
    );
    if (!languageResult) return false;
    await download(
      languageResult.attributes.legacy_subtitle_id,
      languageResult.attributes.language
    );
    return true;
  }, [lastSelectedLanguage, search, download]);

  const toggleLastUsed = useCallback(async () => {
    if (enabled) disable();
    else await downloadLastUsed();
  }, [downloadLastUsed, disable, enabled]);

  return {
    download,
    search,
    disable,
    downloadLastUsed,
    toggleLastUsed,
  };
}
