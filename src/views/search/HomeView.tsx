import { Trans, useTranslation } from "react-i18next";
import { Icon, Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import { useWatchedContext } from "@/state/watched";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { EditButton } from "@/components/buttons/EditButton";
import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useHistory } from "react-router-dom";
import { Modal, ModalCard } from "@/components/layout/Modal";
import { Button } from "@/components/Button";

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

function NewDomainModal() {
  const [show, setShow] = useState(
    new URLSearchParams(window.location.search).get("migrated") === "1"
  );
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    const newParams = new URLSearchParams(history.location.search);
    newParams.delete("migrated");
    history.replace({
      search: newParams.toString(),
    });
  }, [history]);

  // Hi Isra! (TODO remove this in the future lol)
  return (
    <Modal show={show}>
      <ModalCard>
        <div className="mb-12">
          <div
            className="absolute left-0 top-0 h-[300px] w-full -translate-y-1/2 opacity-50"
            style={{
              backgroundImage: `radial-gradient(ellipse 70% 9rem, #7831C1 0%, transparent 100%)`,
            }}
          />
          <div className="relative flex items-center justify-center">
            <div className="rounded-full bg-bink-200 py-4 px-12 text-xl font-bold text-white">
              {t("v3.newDomain")}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            {t("v3.newSiteTitle")}
          </h2>
          <p className="leading-7">
            <Trans i18nKey="v3.newDomainText">
              <span className="font-bold text-white" />
              <span className="font-bold text-white" />
            </Trans>
          </p>
          <p>{t("v3.tireless")}</p>
        </div>
        <div className="mt-16 mb-6 flex items-center justify-center">
          <Button icon={Icons.PLAY} onClick={() => setShow(false)}>
            Take me to the app
          </Button>
        </div>
      </ModalCard>
    </Modal>
  );
}

export function HomeView() {
  return (
    <div className="mb-16 mt-32">
      <NewDomainModal />
      <Bookmarks />
      <Watched />
    </div>
  );
}
