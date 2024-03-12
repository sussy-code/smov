import { useCallback, useMemo } from "react";
import subsrt from "subsrt-ts";
import { ContentCaption } from "subsrt-ts/dist/types/handler";

import { downloadCaption, downloadWebVTT } from "@/backend/helpers/subs";
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
      if (!caption.hls) {
        const srtData = await downloadCaption(caption);
        setCaption({
          id: caption.id,
          language: caption.language,
          srtData,
          url: caption.url,
        });
        resetSubtitleSpecificSettings();
        setLanguage(caption.language);
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
              const parsed = subsrt.parse(vtt);
              return parsed.filter(
                (c) => c.type === "caption",
              ) as ContentCaption[];
            }),
          )
        ).flat();

        // for some reason, in some cases there will be captions
        // with the same start/end times, the same text duplicated
        const filtered = vttCaptions.reduce(
          (acc: ContentCaption[], cap: ContentCaption) => {
            const lastCap = acc[acc.length - 1];
            const isSameAsLast =
              lastCap?.start === cap.start &&
              lastCap?.end === cap.end &&
              lastCap?.content === cap.content;
            if (lastCap === undefined || !isSameAsLast) {
              acc.push(cap);
            }
            return acc;
          },
          [],
        );

        const srtData = subsrt.build(filtered, { format: "srt" });

        setCaption({
          id: caption.id,
          language: caption.language,
          srtData,
          url: caption.url,
        });
        resetSubtitleSpecificSettings();
        setLanguage(caption.language);
      }
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
    selectCaptionById,
  };
}
