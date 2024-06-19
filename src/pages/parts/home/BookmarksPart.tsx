import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditButton } from "@/components/buttons/EditButton";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useProgressStore } from "@/stores/progress";
import { MediaItem } from "@/utils/mediaTypes";

export function BookmarksPart({
  onItemsChange,
}: {
  onItemsChange: (hasItems: boolean) => void;
}) {
  const { t } = useTranslation();
  const progressItems = useProgressStore((state) => state.items);
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  const items = useMemo(() => {
    // Transform bookmarks object into an array of MediaItem
    const transformedItems: MediaItem[] = Object.keys(bookmarks).map((id) => {
      const { title, year, poster, type, updatedAt } = bookmarks[id];
      return {
        id,
        title,
        year,
        poster,
        type,
        updatedAt,
        seasons: type === "show" ? [] : undefined, // Ensure seasons is defined for 'show' type
      };
    });

    // Sort items based on the latest update time
    transformedItems.sort((a, b) => {
      const aUpdatedAt = Math.max(
        bookmarks[a.id].updatedAt,
        progressItems[a.id]?.updatedAt ?? 0,
      );
      const bUpdatedAt = Math.max(
        bookmarks[b.id].updatedAt,
        progressItems[b.id]?.updatedAt ?? 0,
      );
      return bUpdatedAt - aUpdatedAt;
    });

    return transformedItems;
  }, [bookmarks, progressItems]);

  useEffect(() => {
    onItemsChange(items.length > 0); // Notify parent component if there are items
  }, [items, onItemsChange]);

  if (items.length === 0) return null; // If there are no items, return null

  return (
    <div>
      <SectionHeading
        title={t("home.bookmarks.sectionTitle") || "Bookmarks"}
        icon={Icons.BOOKMARK}
      >
        <EditButton editing={editing} onEdit={setEditing} />
      </SectionHeading>
      <MediaGrid ref={gridRef}>
        {items.map((item) => (
          <WatchedMediaCard
            key={item.id}
            media={item}
            closable={editing}
            onClose={() => removeBookmark(item.id)}
          />
        ))}
      </MediaGrid>
    </div>
  );
}
