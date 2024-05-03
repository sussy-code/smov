import { useCallback, useMemo } from "react";

import { Icons } from "@/components/Icon";
import { useBookmarkStore } from "@/stores/bookmarks";
import { PlayerMeta } from "@/stores/player/slices/source";
import { MediaItem } from "@/utils/mediaTypes";

import { IconPatch } from "../buttons/IconPatch";

interface MediaBookmarkProps {
  media: MediaItem;
}

export function MediaBookmarkButton({ media }: MediaBookmarkProps) {
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const meta: PlayerMeta | undefined = useMemo(() => {
    return media.year !== undefined
      ? {
          type: media.type,
          title: media.title,
          tmdbId: media.id,
          releaseYear: media.year,
          poster: media.poster,
        }
      : undefined;
  }, [media]);
  const isBookmarked = !!bookmarks[meta?.tmdbId ?? ""];

  const toggleBookmark = useCallback(() => {
    if (!meta) return;
    if (isBookmarked) removeBookmark(meta.tmdbId);
    else addBookmark(meta);
  }, [isBookmarked, meta, addBookmark, removeBookmark]);

  return (
    <IconPatch
      onClick={toggleBookmark}
      icon={isBookmarked ? Icons.BOOKMARK : Icons.BOOKMARK_OUTLINE}
      className="p-2 opacity-75 transition-opacity transition-transform duration-300 hover:opacity-95 hover:scale-110"
    />
  );
}
