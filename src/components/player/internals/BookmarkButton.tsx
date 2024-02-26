import { useCallback } from "react";

import { Icons } from "@/components/Icon";
import { useBookmarkStore } from "@/stores/bookmarks";
import { usePlayerStore } from "@/stores/player/store";

import { VideoPlayerButton } from "./Button";

export function BookmarkButton() {
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const meta = usePlayerStore((s) => s.meta);
  const isBookmarked = !!bookmarks[meta?.tmdbId ?? ""];

  const toggleBookmark = useCallback(() => {
    if (!meta) return;
    if (isBookmarked) removeBookmark(meta.tmdbId);
    else addBookmark(meta);
  }, [isBookmarked, meta, addBookmark, removeBookmark]);

  return (
    <VideoPlayerButton
      onClick={() => toggleBookmark()}
      icon={isBookmarked ? Icons.BOOKMARK : Icons.BOOKMARK_OUTLINE}
      iconSizeClass="text-base"
      className="p-3"
    />
  );
}
