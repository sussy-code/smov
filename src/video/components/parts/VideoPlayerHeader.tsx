import { MWMediaMeta } from "@/backend/metadata/types";
import { IconPatch } from "@/components/buttons/IconPatch";
import { Icon, Icons } from "@/components/Icon";
import { BrandPill } from "@/components/layout/BrandPill";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import { AirplayAction } from "@/video/components/actions/AirplayAction";
import { ChromecastAction } from "@/video/components/actions/ChromecastAction";
import { useTranslation } from "react-i18next";

interface VideoPlayerHeaderProps {
  media?: MWMediaMeta;
  onClick?: () => void;
  showControls?: boolean;
}

export function VideoPlayerHeader(props: VideoPlayerHeaderProps) {
  const { bookmarkStore, setItemBookmark } = useBookmarkContext();
  const isBookmarked = props.media
    ? getIfBookmarkedFromPortable(bookmarkStore.bookmarks, props.media)
    : false;
  const showDivider = props.media && props.onClick;
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <div className="flex flex-1 items-center">
        <p className="flex items-center">
          {props.onClick ? (
            <span
              onClick={props.onClick}
              className="flex cursor-pointer items-center py-1 text-white opacity-50 transition-opacity hover:opacity-100"
            >
              <Icon className="mr-2" icon={Icons.ARROW_LEFT} />
              <span>{t("videoPlayer.backToHome")}</span>
            </span>
          ) : null}
          {showDivider ? (
            <span className="mx-4 h-6 w-[1.5px] rotate-[30deg] bg-white opacity-50" />
          ) : null}
          {props.media ? (
            <span className="flex items-center text-white">
              <span>{props.media.title}</span>
            </span>
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
        <BrandPill />
      )}
    </div>
  );
}
