import { useCallback } from "react";

import { downloadSrt, searchSubtitles } from "@/backend/helpers/subs";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";

export function useCaptions() {
  const setLanguage = useSubtitleStore((s) => s.setLanguage);
  const enabled = useSubtitleStore((s) => s.enabled);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const lastSelectedLanguage = useSubtitleStore((s) => s.lastSelectedLanguage);
  const meta = usePlayerStore((s) => s.meta);

  const download = useCallback(
    async (subtitleId: string, language: string) => {
      const srtData = await downloadSrt(subtitleId);
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
    return searchSubtitles(meta);
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
    if (!enabled) await downloadLastUsed();
    else disable();
  }, [downloadLastUsed, disable, enabled]);

  return {
    download,
    search,
    disable,
    downloadLastUsed,
    toggleLastUsed,
  };
}
