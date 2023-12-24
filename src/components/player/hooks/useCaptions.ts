import { useCallback } from "react";

import { downloadCaption } from "@/backend/helpers/subs";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";

export function useCaptions() {
  const setLanguage = useSubtitleStore((s) => s.setLanguage);
  const enabled = useSubtitleStore((s) => s.enabled);
  const resetSubtitleSpecificSettings = useSubtitleStore(
    (s) => s.resetSubtitleSpecificSettings,
  );
  const setCaption = usePlayerStore((s) => s.setCaption);
  const lastSelectedLanguage = useSubtitleStore((s) => s.lastSelectedLanguage);
  const captionList = usePlayerStore((s) => s.captionList);

  const selectLanguage = useCallback(
    async (language: string) => {
      const caption = captionList.find((v) => v.language === language);
      if (!caption) return;
      const srtData = await downloadCaption(caption);
      setCaption({
        language: caption.language,
        srtData,
        url: caption.url,
      });
      resetSubtitleSpecificSettings();
      setLanguage(language);
    },
    [setLanguage, captionList, setCaption, resetSubtitleSpecificSettings],
  );

  const disable = useCallback(async () => {
    setCaption(null);
    setLanguage(null);
  }, [setCaption, setLanguage]);

  const selectLastUsedLanguage = useCallback(async () => {
    const language = lastSelectedLanguage ?? "en";
    await selectLanguage(language);
    return true;
  }, [lastSelectedLanguage, selectLanguage]);

  const toggleLastUsed = useCallback(async () => {
    if (enabled) disable();
    else await selectLastUsedLanguage();
  }, [selectLastUsedLanguage, disable, enabled]);

  const selectLastUsedLanguageIfEnabled = useCallback(async () => {
    if (enabled) await selectLastUsedLanguage();
  }, [selectLastUsedLanguage, enabled]);

  return {
    selectLanguage,
    disable,
    selectLastUsedLanguage,
    toggleLastUsed,
    selectLastUsedLanguageIfEnabled,
  };
}
