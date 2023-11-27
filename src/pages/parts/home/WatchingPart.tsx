import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditButton } from "@/components/buttons/EditButton";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useProgressStore } from "@/stores/progress";
import { shouldShowProgress } from "@/stores/progress/utils";
import { MediaItem } from "@/utils/mediaTypes";

export function WatchingPart() {
  const { t } = useTranslation();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const progressItems = useProgressStore((s) => s.items);
  const removeItem = useProgressStore((s) => s.removeItem);
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  const sortedProgressItems = useMemo(() => {
    let output: MediaItem[] = [];
    Object.entries(progressItems)
      .filter((entry) => shouldShowProgress(entry[1]).show)
      .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
      .forEach((entry) => {
        output.push({
          id: entry[0],
          ...entry[1],
        });
      });

    output = output.filter((v) => {
      const isBookMarked = !!bookmarks[v.id];
      return !isBookMarked;
    });
    return output;
  }, [progressItems, bookmarks]);

  if (sortedProgressItems.length === 0) return null;

  return (
    <div>
      <SectionHeading
        title={t("home.continueWatching.sectionTitle")}
        icon={Icons.CLOCK}
      >
        <EditButton editing={editing} onEdit={setEditing} />
      </SectionHeading>
      <MediaGrid ref={gridRef}>
        {sortedProgressItems.map((v) => (
          <WatchedMediaCard
            key={v.id}
            media={v}
            closable={editing}
            onClose={() => removeItem(v.id)}
          />
        ))}
      </MediaGrid>
    </div>
  );
}
