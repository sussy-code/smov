import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditButton } from "@/components/buttons/EditButton";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useBookmarkContext } from "@/state/bookmark";
import { useWatchedContext } from "@/state/watched";

export function BookmarksPart() {
  const { t } = useTranslation();
  const { getFilteredBookmarks, setItemBookmark } = useBookmarkContext();
  const bookmarks = getFilteredBookmarks();
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();
  const { watched } = useWatchedContext();

  const bookmarksSorted = useMemo(() => {
    return bookmarks
      .map((v) => {
        return {
          ...v,
          watched: watched.items
            .sort((a, b) => b.watchedAt - a.watchedAt)
            .find((watchedItem) => watchedItem.item.meta.id === v.id),
        };
      })
      .sort(
        (a, b) => (b.watched?.watchedAt || 0) - (a.watched?.watchedAt || 0)
      );
  }, [watched.items, bookmarks]);

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
        {bookmarksSorted.map((v) => (
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
