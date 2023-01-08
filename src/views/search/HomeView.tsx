import { useTranslation } from "react-i18next";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import { useWatchedContext } from "@/state/watched";

function Bookmarks() {
  const { t } = useTranslation();
  const { getFilteredBookmarks } = useBookmarkContext();
  const bookmarks = getFilteredBookmarks();

  if (bookmarks.length === 0) return null;

  return (
    <SectionHeading
      title={t("search.bookmarks") || "Bookmarks"}
      icon={Icons.BOOKMARK}
    >
      <MediaGrid>
        {bookmarks.map((v) => (
          <WatchedMediaCard
            key={[v.mediaId, v.providerId].join("|")}
            media={v}
          />
        ))}
      </MediaGrid>
    </SectionHeading>
  );
}

function Watched() {
  const { t } = useTranslation();
  const { getFilteredBookmarks } = useBookmarkContext();
  const { getFilteredWatched } = useWatchedContext();

  const bookmarks = getFilteredBookmarks();
  const watchedItems = getFilteredWatched().filter(
    (v) => !getIfBookmarkedFromPortable(bookmarks, v)
  );

  if (watchedItems.length === 0) return null;

  return (
    <SectionHeading
      title={t("search.continueWatching") || "Continue Watching"}
      icon={Icons.CLOCK}
    >
      <MediaGrid>
        {watchedItems.map((v) => (
          <WatchedMediaCard
            key={[v.mediaId, v.providerId].join("|")}
            media={v}
            series
          />
        ))}
      </MediaGrid>
    </SectionHeading>
  );
}

export function HomeView() {
  return (
    <div className="mb-16 mt-32">
      <Bookmarks />
      <Watched />
    </div>
  );
}
