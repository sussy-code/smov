import { useTranslation } from "react-i18next";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import { useWatchedContext } from "@/state/watched";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { EditButton } from "@/components/buttons/EditButton";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Bookmarks() {
  const { t } = useTranslation();
  const { getFilteredBookmarks, setItemBookmark } = useBookmarkContext();
  const bookmarks = getFilteredBookmarks();
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  if (bookmarks.length === 0) return null;

  return (
    <div>
      <SectionHeading
        title={t("search.bookmarks") || "Bookmarks"}
        icon={Icons.BOOKMARK}
      >
        <EditButton editing={editing} onEdit={setEditing} />
      </SectionHeading>
      <MediaGrid ref={gridRef}>
        {bookmarks.map((v) => (
          <WatchedMediaCard
            key={v.id}
            media={v}
            closable={editing}
            onClose={() => setItemBookmark(v, false)}
          />
        ))}
      </MediaGrid>
    </div>
  );
}

function Watched() {
  const { t } = useTranslation();
  const { getFilteredBookmarks } = useBookmarkContext();
  const { getFilteredWatched, removeProgress } = useWatchedContext();
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  const bookmarks = getFilteredBookmarks();
  const watchedItems = getFilteredWatched().filter(
    (v) => !getIfBookmarkedFromPortable(bookmarks, v.item.meta)
  );

  if (watchedItems.length === 0) return null;

  return (
    <div>
      <SectionHeading
        title={t("search.continueWatching") || "Continue Watching"}
        icon={Icons.CLOCK}
      >
        <EditButton editing={editing} onEdit={setEditing} />
      </SectionHeading>
      <MediaGrid ref={gridRef}>
        {watchedItems.map((v) => (
          <WatchedMediaCard
            key={v.item.meta.id}
            media={v.item.meta}
            closable={editing}
            onClose={() => removeProgress(v.item.meta.id)}
          />
        ))}
      </MediaGrid>
    </div>
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
