import { useTranslation } from "react-i18next";

import { MWMediaMeta } from "@/backend/metadata/types/mw";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";
import { useBannerSize } from "@/hooks/useBanner";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import { AirplayAction } from "@/video/components/actions/AirplayAction";
import { ChromecastAction } from "@/video/components/actions/ChromecastAction";

interface VideoPlayerHeaderProps {
  media?: MWMediaMeta;
  onClick?: () => void;
  showControls?: boolean;
  isFullScreen?: boolean;
}

export function VideoPlayerHeader(props: VideoPlayerHeaderProps) {
  const { isMobile } = useIsMobile();
  const { bookmarkStore, setItemBookmark } = useBookmarkContext();
  const isBookmarked = props.media
    ? getIfBookmarkedFromPortable(bookmarkStore.bookmarks, props.media)
    : false;
  const showDivider = props.media && props.onClick;
  const { t } = useTranslation();
  const bannerHeight = useBannerSize();

  return (
    <div
      className="flex items-center"
      style={{
        paddingTop: props.isFullScreen ? `${bannerHeight}px` : undefined,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <p className="flex items-center truncate">
          {props.onClick ? (
            <span
              onClick={props.onClick}
              className="flex cursor-pointer items-center py-1 text-white opacity-50 transition-opacity hover:opacity-100"
            >
              <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
              {isMobile ? (
                <span>{t("videoPlayer.backToHomeShort")}</span>
              ) : (
                <span>{t("videoPlayer.backToHome")}</span>
              )}
            </span>
          ) : null}
          {showDivider ? (
            <span className="mx-4 h-6 w-[1.5px] rotate-[30deg] bg-white opacity-50" />
          ) : null}
          {props.media ? (
            <span className="truncate text-white">{props.media.title}</span>
          ) : null}
        </p>
        {props.media && (
          <IconPatch
            clickable
            transparent
            icon={isBookmarked ? Icons.BOOKMARK : Icons.BOOKMARK_OUTLINE}
            className="ml-2 text-white"
            onClick={() =>
              props.media && setItemBookmark(props.media, !isBookmarked)
            }
          />
        )}
      </div>
      {props.showControls ? (
        <>
          <AirplayAction />
          <ChromecastAction />
        </>
      ) : (
        <BrandPill hideTextOnMobile />
      )}
    </div>
  );
}
