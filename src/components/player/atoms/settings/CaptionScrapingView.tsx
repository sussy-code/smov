import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { convert } from "subsrt-ts";

import { Toggle } from "@/components/buttons/Toggle";
import { Icon, Icons } from "@/components/Icon";
import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { useProgressBar } from "@/hooks/useProgressBar";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";

import { CaptionSetting, ColorOption } from "./CaptionSettingsView";

// Define a type for the caption objects
interface Caption {
  name: string;
  link: string;
}

function CustomCaptionOption() {
  const { t } = useTranslation();
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const setCustomSubs = useSubtitleStore((s) => s.setCustomSubs);

  const [captions, setCaptions] = useState<Caption[]>([]); // Specify the type here

  useEffect(() => {
    const response: Caption[] = [
      {
        name: "en-US",
        link: "https://www.yourowndomain.com/path/to/subtitle_en.srt",
      },
      {
        name: "es",
        link: "https://www.yourowndomain.com/path/to/subtitle_es.srt",
      },
      {
        name: "fr",
        link: "https://www.yourowndomain.com/path/to/subtitle_fr.srt",
      },
      {
        name: "de",
        link: "https://www.yourowndomain.com/path/to/subtitle_de.srt",
      },
    ];
    // Example - this should be the response you retrieve from your API
    // Replace the hardcoded `response` with your actual data-fetching logic

    setCaptions(response);
  }, []);

  const fetchSubtitle = async (link: string) => {
    try {
      const res = await fetch(link);
      const text = await res.text();
      // Assuming `convert` is properly defined and imported to convert subtitle file contents to srt format.
      const converted = convert(text, "srt");
      setCaption({
        language: "custom",
        srtData: converted,
        id: "custom-caption",
      });
      setCustomSubs();
    } catch (error) {
      console.error("Error fetching subtitle:", error);
    }
  };

  return (
    <div>
      {captions.map((caption) => (
        <button
          type="button"
          key={caption.name}
          onClick={() => fetchSubtitle(caption.link)}
        >
          {t(`player.menus.subtitles.${caption.name}`)}
        </button>
      ))}
    </div>
  );
}

export const colors = ["#ffffff", "#b0b0b0", "#80b1fa", "#e2e535"];

export function CaptionScrapingView({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useOverlayRouter(id);
  const styling = useSubtitleStore((s) => s.styling);
  const overrideCasing = useSubtitleStore((s) => s.overrideCasing);
  const delay = useSubtitleStore((s) => s.delay);
  const setOverrideCasing = useSubtitleStore((s) => s.setOverrideCasing);
  const setDelay = useSubtitleStore((s) => s.setDelay);
  const updateStyling = useSubtitleStore((s) => s.updateStyling);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/captions")}>
        {t("player.menus.scraping.settings.backlink")}
      </Menu.BackLink>
      <Menu.Section className="space-y-6 pb-5">
        <CustomCaptionOption />
      </Menu.Section>
    </>
  );
}
