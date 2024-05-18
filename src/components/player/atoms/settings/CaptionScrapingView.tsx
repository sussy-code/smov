import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncFn } from "react-use";
import { convert } from "subsrt-ts";

import { Icon, Icons } from "@/components/Icon";
import { useCaptions } from "@/components/player/hooks/useCaptions";
import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";
import { getPrettyLanguageNameFromLocale } from "@/utils/language";

import { CaptionOption } from "./CaptionsView";

type FetchType = {
  id: string;
  url: string;
  type: string;
  language: string;
  hasCorsRestrictions: boolean;
};

async function search(imdbId: string, season?: number, episode?: number) {
  const base = "https://rest.opensubtitles.org";
  const headers = { "X-User-Agent": "VLSub 0.10.2" };
  const url = `${base}/search/${season && episode ? `episode-${episode}/` : ""}imdbid-${imdbId}${season ? `/season-${season}` : ""}`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  let subtitles = data.map(
    (sub: { SubDownloadLink: string; SubFormat: string; ISO639: string }) => {
      const caption = sub.SubDownloadLink.replace(".gz", "").replace(
        "download/",
        "download/subencoding-utf8/",
      );
      return {
        id: caption,
        url: caption,
        type: sub.SubFormat,
        language: sub.ISO639,
        hasCorsRestrictions: false,
      };
    },
  );

  subtitles = subtitles.reduce((unique: FetchType[], o: FetchType) => {
    if (!unique.find((obj: FetchType) => obj.language === o.language)) {
      unique.push(o);
    }
    return unique;
  }, []);

  return subtitles;
}

export const colors = ["#ffffff", "#b0b0b0", "#80b1fa", "#e2e535"];

export function CaptionScrapingView({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useOverlayRouter(id);
  const meta = usePlayerStore((s) => s.meta);
  const imdbID = meta?.imdbId ? meta.imdbId.slice(2) : "";
  const [data, setData] = useState<FetchType[]>([]);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const [selectedCaptionId, setSelectedCaptionId] = useState<
    string | undefined
  >();
  const selectedId = usePlayerStore((s) => s.caption.selected?.id);

  useEffect(() => {
    setSelectedCaptionId(selectedId);
    console.log(selectedId);
  }, [selectedId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await search(imdbID);
      setData(result);
    };

    fetchData();
  }, [imdbID]);

  return (
    <>
      <Menu.BackLink onClick={() => router.navigate("/captions")}>
        {t("player.menus.scraping.settings.backlink")}
      </Menu.BackLink>
      <Menu.ScrollToActiveSection className="!pt-1 mt-2 pb-3">
        {data.map((v) => (
          <CaptionOption
            // key must use index to prevent url collisions
            key={v.id}
            countryCode={v.language}
            selected={v.id === selectedCaptionId}
            onClick={async () => {
              const text = await (await fetch(v.url)).text();
              const converted = convert(text, "srt");
              setCaption({
                language: "custom",
                srtData: converted,
                id: "custom-caption",
              });
            }}
          >
            {getPrettyLanguageNameFromLocale(v.language)}
          </CaptionOption>
        ))}
      </Menu.ScrollToActiveSection>
    </>
  );
}
