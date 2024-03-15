import Fuse from "fuse.js";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncFn } from "react-use";
import { convert } from "subsrt-ts";

import { subtitleTypeList } from "@/backend/helpers/subs";
import { FlagIcon } from "@/components/FlagIcon";
import { useCaptions } from "@/components/player/hooks/useCaptions";
import { Menu } from "@/components/player/internals/ContextMenu";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { CaptionListItem } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";
import { useSubtitleStore } from "@/stores/subtitles";
import {
  getPrettyLanguageNameFromLocale,
  sortLangCodes,
} from "@/utils/language";

export function CaptionOption(props: {
  countryCode?: string;
  children: React.ReactNode;
  selected?: boolean;
  loading?: boolean;
  onClick?: () => void;
  error?: React.ReactNode;
}) {
  return (
    <SelectableLink
      selected={props.selected}
      loading={props.loading}
      error={props.error}
      onClick={props.onClick}
    >
      <span
        data-active-link={props.selected ? true : undefined}
        className="flex items-center"
      >
        <span data-code={props.countryCode} className="mr-3 inline-flex">
          <FlagIcon langCode={props.countryCode} />
        </span>
        <span>{props.children}</span>
      </span>
    </SelectableLink>
  );
}

function CustomCaptionOption() {
  const { t } = useTranslation();
  const lang = usePlayerStore((s) => s.caption.selected?.language);
  const setCaption = usePlayerStore((s) => s.setCaption);
  const setCustomSubs = useSubtitleStore((s) => s.setCustomSubs);
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <CaptionOption
      selected={lang === "custom"}
      onClick={() => fileInput.current?.click()}
    >
      {t("player.menus.subtitles.customChoice")}
      <input
        className="hidden"
        ref={fileInput}
        accept={subtitleTypeList.join(",")}
        type="file"
        onChange={(e) => {
          if (!e.target.files) return;
          const reader = new FileReader();
          reader.addEventListener("load", (event) => {
            if (!event.target || typeof event.target.result !== "string")
              return;
            const converted = convert(event.target.result, "srt");
            setCaption({
              language: "custom",
              srtData: converted,
              id: "custom-caption",
            });
            setCustomSubs();
          });
          reader.readAsText(e.target.files[0], "utf-8");
        }}
      />
    </CaptionOption>
  );
}

function useSubtitleList(subs: CaptionListItem[], searchQuery: string) {
  const { t: translate } = useTranslation();
  const unknownChoice = translate("player.menus.subtitles.unknownLanguage");
  return useMemo(() => {
    const input = subs.map((t) => ({
      ...t,
      languageName:
        getPrettyLanguageNameFromLocale(t.language) ?? unknownChoice,
    }));
    const sorted = sortLangCodes(input.map((t) => t.language));
    let results = input.sort((a, b) => {
      return sorted.indexOf(a.language) - sorted.indexOf(b.language);
    });

    if (searchQuery.trim().length > 0) {
      const fuse = new Fuse(input, {
        includeScore: true,
        keys: ["languageName"],
      });

      results = fuse.search(searchQuery).map((res) => res.item);
    }

    return results;
  }, [subs, searchQuery, unknownChoice]);
}

export function CaptionsView({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useOverlayRouter(id);
  const selectedCaptionId = usePlayerStore((s) => s.caption.selected?.id);
  const [currentlyDownloading, setCurrentlyDownloading] = useState<
    string | null
  >(null);
  const { selectCaptionById, disable } = useCaptions();
  const captionList = usePlayerStore((s) => s.captionList);
  const getHlsCaptionList = usePlayerStore((s) => s.display?.getCaptionList);

  const captions = useMemo(
    () =>
      captionList.length !== 0 ? captionList : getHlsCaptionList?.() ?? [],
    [captionList, getHlsCaptionList],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const subtitleList = useSubtitleList(captions, searchQuery);

  const [downloadReq, startDownload] = useAsyncFn(
    async (captionId: string) => {
      setCurrentlyDownloading(captionId);
      return selectCaptionById(captionId);
    },
    [selectCaptionById, setCurrentlyDownloading],
  );

  const content = subtitleList.map((v) => {
    return (
      <CaptionOption
        // key must use index to prevent url collisions
        key={v.id}
        countryCode={v.language}
        selected={v.id === selectedCaptionId}
        loading={v.id === currentlyDownloading && downloadReq.loading}
        error={
          v.id === currentlyDownloading && downloadReq.error
            ? downloadReq.error.toString()
            : undefined
        }
        onClick={() => startDownload(v.id)}
      >
        {v.languageName}
      </CaptionOption>
    );
  });

  return (
    <>
      <div>
        <Menu.BackLink
          onClick={() => router.navigate("/")}
          rightSide={
            <button
              type="button"
              onClick={() => router.navigate("/captions/settings")}
              className="py-1 -my-1 px-3 -mx-3 rounded tabbable"
            >
              {t("player.menus.subtitles.customizeLabel")}
            </button>
          }
        >
          {t("player.menus.subtitles.title")}
        </Menu.BackLink>
        <div className="mt-3">
          <Input value={searchQuery} onInput={setSearchQuery} />
        </div>
      </div>
      <Menu.ScrollToActiveSection className="!pt-1 mt-2 pb-3">
        <CaptionOption onClick={() => disable()} selected={!selectedCaptionId}>
          {t("player.menus.subtitles.offChoice")}
        </CaptionOption>
        <CustomCaptionOption />
        {content}
      </Menu.ScrollToActiveSection>
    </>
  );
}

export default CaptionsView;
