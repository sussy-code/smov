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
import { useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { VideoPlayerIconButton } from "@/video/components/parts/VideoPlayerIconButton";
import { useHistory, useLocation } from "react-router-dom";

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

function NewDomainInfo() {
  const location = useLocation();
  const history = useHistory();

  return (
    <div className="relative -mx-5 rounded-r-lg rounded-l border-l-4 border-bink-400 bg-denim-300 px-5 py-6">
      <VideoPlayerIconButton
        icon={Icons.X}
        className="absolute top-0 right-0 m-2"
        onClick={() => {
          const queryParams = new URLSearchParams(location.search);
          queryParams.delete("redirected");
          history.replace({
            search: queryParams.toString(),
          });
        }}
      />
      <h2 className="text-lg font-bold text-white">Hey there!</h2>
      <p className="my-3">
        Welcome to the long-awaited shiny new update of movie-web. This awesome
        updates includes an awesome new look, updated functionality, and even a
        fully custom-built video player.
      </p>
      <p className="text-purple-200">
        We also have a new domain! Please be sure to update your bookmarks, as
        the old domain is going to stop working on <strong>May 31st</strong>.
        The new domain is <strong>movie-web.app</strong>
      </p>
    </div>
  );
}

export function HomeView() {
  const location = useLocation();

  const showNewDomainInfo = useMemo(() => {
    return location.search.includes("redirected=1");
  }, [location.search]);

  return (
    <div className={["mb-16", showNewDomainInfo ? "mt-16" : "mt-32"].join(" ")}>
      {showNewDomainInfo ? <NewDomainInfo /> : ""}
      <Bookmarks />
      <Watched />
    </div>
  );
}
