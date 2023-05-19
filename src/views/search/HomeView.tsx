import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Button } from "@/components/Button";
import { EditButton } from "@/components/buttons/EditButton";
import { Icons } from "@/components/Icon";
import { Modal, ModalCard } from "@/components/layout/Modal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import { useWatchedContext } from "@/state/watched";

import { EmbedMigration } from "../other/v2Migration";

function Bookmarks() {
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
    new URLSearchParams(window.location.search).get("migrated") === "1" ||
      localStorage.getItem("mw-show-domain-modal") === "true"
  );
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  const closeModal = useCallback(() => {
    localStorage.setItem("mw-show-domain-modal", "false");
    setShow(false);
  }, []);

  useEffect(() => {
    const newParams = new URLSearchParams(history.location.search);
    newParams.delete("migrated");
    if (newParams.get("migrated") === "1")
      localStorage.setItem("mw-show-domain-modal", "true");
    history.replace({
      search: newParams.toString(),
    });
  }, [history]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  // If you see this bit of code, don't snitch!
  // We need to urge users to update their bookmarks and usage,
  // so we're putting a fake deadline that's only 2 weeks away.
  const day = 1e3 * 60 * 60 * 24;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const firstVisitToSite = new Date(
    localStorage.getItem("firstVisitToSite") || Date.now()
  );
  localStorage.setItem("firstVisitToSite", firstVisitToSite.toISOString());
  const fakeEndResult = new Date(firstVisitToSite.getTime() + 14 * day);
  const endDateString = `${fakeEndResult.getDate()} ${
    months[fakeEndResult.getMonth()]
  } ${fakeEndResult.getFullYear()}`;

  return (
    <Modal show={show && loaded}>
      <ModalCard>
        <div className="mb-12">
          <div
            className="absolute left-0 top-0 h-[300px] w-full -translate-y-1/2 opacity-50"
            style={{
              backgroundImage: `radial-gradient(ellipse 70% 9rem, #7831C1 0%, transparent 100%)`,
            }}
          />
          <div className="relative flex items-center justify-center">
            <div className="rounded-full bg-bink-200 px-12 py-4 text-center text-sm font-bold text-white md:text-xl">
              {t("v3.newDomain")}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            {t("v3.newSiteTitle")}
          </h2>
          <p className="leading-7">
            <Trans i18nKey="v3.newDomainText" values={{ date: endDateString }}>
              <span className="text-slate-300" />
              <span className="font-bold text-white" />
            </Trans>
          </p>
          <p>{t("v3.tireless")}</p>
        </div>
        <div className="mb-6 mt-16 flex items-center justify-center">
          <Button icon={Icons.PLAY} onClick={() => closeModal()}>
            {t("v3.leaveAnnouncement")}
          </Button>
        </div>
      </ModalCard>
    </Modal>
  );
}

export function HomeView() {
  return (
    <div className="mb-16">
      <EmbedMigration />
      <NewDomainModal />
      <Bookmarks />
      <Watched />
    </div>
  );
}
