import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncFn } from "react-use";

import { useCaptions } from "@/components/player/hooks/useCaptions";
import { Menu } from "@/components/player/internals/ContextMenu";
import { Input } from "@/components/player/internals/ContextMenu/Input";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { usePlayerStore } from "@/stores/player/store";

import { CaptionOption } from "./CaptionsView";
import { useSubtitleList } from "./SourceCaptionsView";

export function OpenSubtitlesCaptionView({
  id,
  overlayBackLink,
}: {
  id: string;
  overlayBackLink?: true;
}) {
  const { t } = useTranslation();
  const router = useOverlayRouter(id);
  const selectedCaptionId = usePlayerStore((s) => s.caption.selected?.id);
  const [currentlyDownloading, setCurrentlyDownloading] = useState<
    string | null
  >(null);
  const { selectCaptionById } = useCaptions();
  const captionList = usePlayerStore((s) => s.captionList);
  const getHlsCaptionList = usePlayerStore((s) => s.display?.getCaptionList);

  const captions = useMemo(
    () =>
      captionList.length !== 0 ? captionList : (getHlsCaptionList?.() ?? []),
    [captionList, getHlsCaptionList],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const subtitleList = useSubtitleList(
    captions.filter((x) => x.opensubtitles),
    searchQuery,
  );

  const [downloadReq, startDownload] = useAsyncFn(
    async (captionId: string) => {
      setCurrentlyDownloading(captionId);
      return selectCaptionById(captionId);
    },
    [selectCaptionById, setCurrentlyDownloading],
  );

  const content = subtitleList.length
    ? subtitleList.map((v) => {
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
      })
    : t("player.menus.subtitles.notFound");

  return (
    <>
      <div>
        <Menu.BackLink
          onClick={() =>
            router.navigate(overlayBackLink ? "/captionsOverlay" : "/captions")
          }
        >
          {t("player.menus.subtitles.OpenSubtitlesChoice")}
        </Menu.BackLink>
      </div>
      {captionList.filter((x) => x.opensubtitles).length ? (
        <div className="mt-3">
          <Input value={searchQuery} onInput={setSearchQuery} />
        </div>
      ) : null}
      <Menu.ScrollToActiveSection className="!pt-1 mt-2 pb-3">
        {!captionList.filter((x) => x.opensubtitles).length ? (
          <div className="p-4 rounded-xl bg-video-context-light bg-opacity-10 font-medium text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              {t("player.menus.subtitles.empty")}
            </div>
          </div>
        ) : (
          <div className="text-center">{content}</div>
        )}
      </Menu.ScrollToActiveSection>
    </>
  );
}

export default OpenSubtitlesCaptionView;
