import { useCallback, useMemo } from "react";
import subsrt, { convert } from "subsrt-ts";

import { proxiedFetch } from "@/backend/helpers/fetch";
import { downloadCaption, downloadWebVTT } from "@/backend/helpers/subs";
import { Caption } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";

import {
  filterDuplicateCaptionCues,
  parseVttSubtitles,
} from "../utils/captions";

export function useCaptions() {
  const setLanguage = useSubtitleStore((s) => s.setLanguage);
  const enabled = useSubtitleStore((s) => s.enabled);
  const resetSubtitleSpecificSettings = useSubtitleStore(
    (s) => s.resetSubtitleSpecificSettings,
  );
  const setCaption = usePlayerStore((s) => s.setCaption);
  const lastSelectedLanguage = useSubtitleStore((s) => s.lastSelectedLanguage);
  const scrapedSubtitlesLast = useSubtitleStore((s) => s.scrapedSubtitlesLast);
  const scrapedSubtitles = useSubtitleStore((s) => s.lastScraped);
  const scrapedSubtitlesLang = useSubtitleStore((s) => s.lastScrapedLanguage);

  const setScrapeSubtitles = useSubtitleStore((s) => s.setScrapeSubtitles);
  const setScrapedLanguage = useSubtitleStore((s) => s.setScrapeSubtitlesLang);

  const captionList = usePlayerStore((s) => s.captionList);
  const getHlsCaptionList = usePlayerStore((s) => s.display?.getCaptionList);

  const getSubtitleTracks = usePlayerStore((s) => s.display?.getSubtitleTracks);
  const setSubtitlePreference = usePlayerStore(
    (s) => s.display?.setSubtitlePreference,
  );

  const captions = useMemo(
    () =>
      captionList.length !== 0 ? captionList : getHlsCaptionList?.() ?? [],
    [captionList, getHlsCaptionList],
  );

  const selectCaptionById = useCallback(
    async (captionId: string) => {
      const caption = captions.find((v) => v.id === captionId);
      if (!caption) return;

      const captionToSet: Caption = {
        id: caption.id,
        language: caption.language,
        url: caption.url,
        srtData: "",
      };

      if (!caption.hls) {
        const srtData = await downloadCaption(caption);
        captionToSet.srtData = srtData;
      } else {
        // request a language change to hls, so it can load the subtitles
        await setSubtitlePreference?.(caption.language);
        const track = getSubtitleTracks?.().find(
          (t) => t.id.toString() === caption.id && t.details !== undefined,
        );
        if (!track) return;

        const fragments =
          track.details?.fragments?.filter(
            (frag) => frag !== null && frag.url !== null,
          ) ?? [];

        const vttCaptions = (
          await Promise.all(
            fragments.map(async (frag) => {
              const vtt = await downloadWebVTT(frag.url);
              return parseVttSubtitles(vtt);
            }),
          )
        ).flat();

        const filtered = filterDuplicateCaptionCues(vttCaptions);

        const srtData = subsrt.build(filtered, { format: "srt" });
        captionToSet.srtData = srtData;
      }

      setCaption(captionToSet);
      resetSubtitleSpecificSettings();
      setLanguage(caption.language);
    },
    [
      setLanguage,
      captions,
      setCaption,
      resetSubtitleSpecificSettings,
      getSubtitleTracks,
      setSubtitlePreference,
    ],
  );

  const selectLanguage = useCallback(
    async (language: string) => {
      const caption = captions.find((v) => v.language === language);
      if (!caption) return;
      return selectCaptionById(caption.id);
    },
    [captions, selectCaptionById],
  );

  const disable = useCallback(async () => {
    setCaption(null);
    setLanguage(null);
  }, [setCaption, setLanguage]);

  const selectLastUsedLanguage = useCallback(async () => {
    if (scrapedSubtitles && scrapedSubtitlesLang && scrapedSubtitlesLast) {
      setScrapeSubtitles(scrapedSubtitles);
      setScrapedLanguage(scrapedSubtitlesLang);
      const text = await (await proxiedFetch(scrapedSubtitles)).text();
      const converted = convert(text, "srt");
      setCaption({
        language: scrapedSubtitlesLang,
        srtData: converted,
        id: `scraped - ${scrapedSubtitlesLang}`,
      });
    } else {
      const language = lastSelectedLanguage ?? "en";
      await selectLanguage(language);
      return true;
    }
  }, [
    lastSelectedLanguage,
    selectLanguage,
    scrapedSubtitlesLast,
    scrapedSubtitles,
    scrapedSubtitlesLang,
    setScrapeSubtitles,
    setScrapedLanguage,
    setCaption,
  ]);

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
    selectCaptionById,
  };
}
