import { useTranslation } from "react-i18next";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import {
  getIfBookmarkedFromPortable,
  useBookmarkContext,
} from "@/state/bookmark";
import {
  useWatchedContext,
  WatchedStoreData,
  WatchedStoreItem,
} from "@/state/watched";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { EditButton } from "@/components/buttons/EditButton";
import { useCallback, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { VideoProgressStore } from "@/state/watched/store";
import { searchForMedia } from "@/backend/metadata/search";
import { DetailedMeta, getMetaFromId } from "@/backend/metadata/getmeta";
import { MWMediaMeta, MWMediaType } from "@/backend/metadata/types";

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

interface OldMediaBase {
  mediaId: number;
  mediaType: MWMediaType;
  percentage: number;
  progress: number;
  providerId: string;
  title: string;
  year: number;
}

interface OldMovie extends OldMediaBase {
  mediaType: MWMediaType.MOVIE;
}

interface OldSeries extends OldMediaBase {
  mediaType: MWMediaType.SERIES;
  episodeId: number;
  seasonId: number;
}

interface OldData {
  items: (OldMovie | OldSeries)[];
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

  /*
    AAA
  */
  const watchedLocalstorage = VideoProgressStore.get();
  const [watched, setWatchedReal] = useState<WatchedStoreData>(
    watchedLocalstorage as WatchedStoreData
  );

  const setWatched = useCallback(
    (data: any) => {
      setWatchedReal((old) => {
        let newData = data;
        if (data.constructor === Function) {
          newData = data(old);
        }
        watchedLocalstorage.save(newData);
        return newData;
      });
    },
    [setWatchedReal, watchedLocalstorage]
  );

  (async () => {
    const oldData: OldData | null = localStorage.getItem("video-progress")
      ? JSON.parse(localStorage.getItem("video-progress") || "")
      : null;

    if (!oldData) return;

    const uniqueMedias: Record<string, any> = {};
    oldData.items.forEach((item: any) => {
      if (uniqueMedias[item.mediaId]) return;
      uniqueMedias[item.mediaId] = item;
    });

    const yearsAreClose = (a: number, b: number) => {
      return Math.abs(a - b) <= 1;
    };

    const mediaMetas: Record<string, Record<string, DetailedMeta | null>> = {};

    Promise.all(
      Object.values(uniqueMedias).map(async (item) => {
        const year = Number(item.year.toString().split("-")[0]);
        const data = await searchForMedia({
          searchQuery: `${item.title} ${year}`,
          type: item.mediaType,
        });
        const relevantItem = data.find((res) =>
          yearsAreClose(Number(res.year), year)
        );
        if (!relevantItem) {
          console.error("No item");
          return;
        }
        return {
          id: item.mediaId,
          data: relevantItem,
        };
      })
    ).then(async (relevantItems) => {
      console.log(relevantItems);
      for (const item of relevantItems.filter(Boolean)) {
        if (!item) continue;

        let keys: (string | null)[][] = [["0", "0"]];
        if (item.data.type === "series") {
          const meta = await getMetaFromId(item.data.type, item.data.id);
          if (!meta || !meta?.meta.seasons) return;
          const seasonNumbers = [
            ...new Set(
              oldData.items
                .filter((watchedEntry: any) => watchedEntry.mediaId === item.id)
                .map((watchedEntry: any) => watchedEntry.seasonId)
            ),
          ];
          const seasons = seasonNumbers
            .map((num) => ({
              num,
              season: meta.meta?.seasons?.[(num as number) - 1],
            }))
            .filter(Boolean);
          keys = seasons
            .map((season) => (season ? [season.num, season?.season?.id] : []))
            .filter((entry) => entry.length > 0); // Stupid TypeScript
        }

        if (!mediaMetas[item.id]) mediaMetas[item.id] = {};
        await Promise.all(
          keys.map(async ([key, id]) => {
            if (!key) return;
            mediaMetas[item.id][key] = await getMetaFromId(
              item.data.type,
              item.data.id,
              id === "0" || id === null ? undefined : id
            );
          })
        );
      }

      // We've got all the metadata you can dream of now
      // Now let's convert stuff into the new format.
      const newData: WatchedStoreData = JSON.parse(JSON.stringify(watched));

      for (const oldWatched of oldData.items) {
        if (oldWatched.mediaType === "movie") {
          if (!mediaMetas[oldWatched.mediaId]["0"]?.meta) continue;

          const newItem: WatchedStoreItem = {
            item: {
              meta: mediaMetas[oldWatched.mediaId]["0"]?.meta as MWMediaMeta,
            },
            progress: oldWatched.progress,
            percentage: oldWatched.percentage,
            watchedAt: Date.now(), // There was no watchedAt in V2
          };
          if (
            newData.items.find(
              (item) => item.item.meta.id === newItem.item.meta.id
            )
          )
            continue;

          oldData.items = oldData.items.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(oldWatched)
          );
          newData.items.push(newItem);
        } else if (oldWatched.mediaType === "series") {
          // console.log(oldWatched);
          // console.log(mediaMetas[oldWatched.mediaId][oldWatched.seasonId]);

          if (!mediaMetas[oldWatched.mediaId][oldWatched.seasonId]?.meta)
            continue;

          const meta = mediaMetas[oldWatched.mediaId][oldWatched.seasonId]
            ?.meta as MWMediaMeta;

          if (meta.type !== "series") return;

          // console.log(meta.seasonData);
          const newItem: WatchedStoreItem = {
            item: {
              meta,
              series: {
                episode: Number(oldWatched.episodeId),
                season: Number(oldWatched.seasonId),
                seasonId: meta.seasonData.id,
                episodeId:
                  meta.seasonData.episodes[Number(oldWatched.episodeId) - 1].id,
              },
            },
            progress: oldWatched.progress,
            percentage: oldWatched.percentage,
            watchedAt: Date.now(), // There was no watchedAt in V2
          };

          if (
            newData.items.find(
              (item) =>
                item.item.meta.id === newItem.item.meta.id &&
                item.item.series?.episodeId === newItem.item.series?.episodeId
            )
          )
            continue;

          oldData.items = oldData.items.filter(
            (item) => JSON.stringify(item) !== JSON.stringify(oldWatched)
          );
          newData.items.push(newItem);
        }
      }

      if (JSON.stringify(newData) !== JSON.stringify(watched)) {
        localStorage.setItem("video-progress", JSON.stringify(oldData));
        setWatched(() => newData);
      }
    });
  })();

  /*
    AAA
  */

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
