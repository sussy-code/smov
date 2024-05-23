import classNames from "classnames";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncFn } from "react-use";

import { FlagIcon } from "@/components/FlagIcon";
import { Icon, Icons } from "@/components/Icon";
import { useCaptions } from "@/components/player/hooks/useCaptions";
import { Menu } from "@/components/player/internals/ContextMenu";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { SelectableLink } from "@/components/player/internals/ContextMenu/Links";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { CaptionListItem } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";
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

function useSubtitleList(subs: CaptionListItem[], searchQuery: string) {
  const { t: translate } = useTranslation();
  const unknownChoice = translate("player.menus.subtitles.unknownLanguage");
  return useMemo(() => {
    const input = subs
      .map((t) => ({
        ...t,
        languageName:
          getPrettyLanguageNameFromLocale(t.language) ?? unknownChoice,
      }))
      .filter((x) => x.opensubtitles);
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

export function OpenSubtitlesCaptionView({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useOverlayRouter(id);
  const selectedCaptionId = usePlayerStore((s) => s.caption.selected?.id);
  const [currentlyDownloading, setCurrentlyDownloading] = useState<
    string | null
  >(null);
  const { selectCaptionById } = useCaptions();
  const captionList = usePlayerStore((s) => s.captionList);
  const getHlsCaptionList = usePlayerStore((s) => s.display?.getCaptionList);
  const [dragging] = useState(false);

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
        <div
          className={classNames(
            "absolute inset-0 flex items-center justify-center text-white z-10 pointer-events-none transition-opacity duration-300",
            dragging ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex flex-col items-center">
            <Icon className="text-5xl mb-4" icon={Icons.UPLOAD} />
            <span className="text-xl weight font-medium">
              {t("player.menus.subtitles.dropSubtitleFile")}
            </span>
          </div>
        </div>

        <Menu.BackLink
          onClick={() => router.navigate("/captions")}
          rightSide={
            <button
              type="button"
              onClick={() => router.navigate("/captions/settings")}
              className="-mr-2 -my-1 px-2 p-[0.4em] rounded tabbable hover:bg-video-context-light hover:bg-opacity-10"
            >
              {t("player.menus.subtitles.customizeLabel")}
            </button>
          }
        >
          {t("player.menus.subtitles.title")}
        </Menu.BackLink>
      </div>
      <div className="mt-3">
        <Input value={searchQuery} onInput={setSearchQuery} />
      </div>
      <Menu.ScrollToActiveSection className="!pt-1 mt-2 pb-3">
        {content}
      </Menu.ScrollToActiveSection>
    </>
  );
}

export default OpenSubtitlesCaptionView;
