import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditButton } from "@/components/buttons/EditButton";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useProgressStore } from "@/stores/progress";
import { shouldShowProgress } from "@/stores/progress/utils";
import { MediaItem } from "@/utils/mediaTypes";

const LONG_PRESS_DURATION = 500; // 0.5 seconds

export function WatchingPart({
  onItemsChange,
}: {
  onItemsChange: (hasItems: boolean) => void;
}) {
  const { t } = useTranslation();
  const progressItems = useProgressStore((s) => s.items);
  const removeItem = useProgressStore((s) => s.removeItem);
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sortedProgressItems = useMemo(() => {
    const output: MediaItem[] = [];
    Object.entries(progressItems)
      .filter((entry) => shouldShowProgress(entry[1]).show)
      .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
      .forEach((entry) => {
        output.push({
          id: entry[0],
          ...entry[1],
        });
      });

    return output;
  }, [progressItems]);

  useEffect(() => {
    onItemsChange(sortedProgressItems.length > 0);
  }, [sortedProgressItems, onItemsChange]);

  const handleLongPress = () => {
    // Find the button by ID and simulate a click
    const editButton = document.getElementById("edit-button-watching");
    if (editButton) {
      (editButton as HTMLButtonElement).click();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default touch action
    pressTimerRef.current = setTimeout(handleLongPress, LONG_PRESS_DURATION);
  };

  const handleTouchEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default mouse action
    pressTimerRef.current = setTimeout(handleLongPress, LONG_PRESS_DURATION);
  };

  const handleMouseUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  if (sortedProgressItems.length === 0) return null;

  return (
    <div
      className="relative"
      style={{ userSelect: "none" }} // Disable text selection
      onContextMenu={(e: React.MouseEvent<HTMLDivElement>) =>
        e.preventDefault()
      } // Prevent right-click context menu
    >
      <SectionHeading
        title={t("home.continueWatching.sectionTitle")}
        icon={Icons.CLOCK}
      >
        <EditButton
          editing={editing}
          onEdit={setEditing}
          id="edit-button-watching"
        />
      </SectionHeading>
      <MediaGrid ref={gridRef}>
        {sortedProgressItems.map((v) => (
          <div
            onTouchStart={handleTouchStart} // Handle touch start
            onTouchEnd={handleTouchEnd} // Handle touch end
            onMouseDown={handleMouseDown} // Handle mouse down
            onMouseUp={handleMouseUp} // Handle mouse up
          >
            <WatchedMediaCard
              key={v.id}
              media={v}
              closable={editing}
              onClose={() => removeItem(v.id)}
            />
          </div>
        ))}
      </MediaGrid>
    </div>
  );
}
