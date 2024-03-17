import classNames from "classnames";
import { useEffect, useState } from "react";

import { getMediaDetails, getMediaPoster } from "@/backend/metadata/tmdb";
import { TMDBContentTypes } from "@/backend/metadata/types/tmdb";
import { ThiccContainer } from "@/components/layout/ThinContainer";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaGrid } from "@/components/media/MediaGrid";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Paragraph } from "@/components/utils/Text";
import { MediaItem } from "@/utils/mediaTypes";

import { SubPageLayout } from "./layouts/SubPageLayout";

function Button(props: {
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      className={classNames(
        "font-bold rounded h-10 w-40 scale-90 hover:scale-95 transition-all duration-200",
        props.className,
      )}
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

function isShowOrMovie(tmdbFullId: string): "show" | "movie" {
  if (tmdbFullId.includes("show-")) {
    return "show";
  }
  if (tmdbFullId.includes("movie-")) {
    return "movie";
  }
  throw new Error("Invalid tmdbFullId");
}

async function getPoster(
  tmdbId: string,
  type: TMDBContentTypes.MOVIE | TMDBContentTypes.TV,
): Promise<string> {
  const details = await getMediaDetails(tmdbId, type);

  const posterPath = getMediaPoster(details.poster_path);

  return posterPath || "";
}

async function getRecentPlayedItems() {
  const response = await fetch("https://backend.sudo-flix.lol/metrics");
  const text = await response.text();

  const regex =
    /mw_media_watch_count{tmdb_full_id="([^"]+)",provider_id="([^"]+)",title="([^"]+)",success="([^"]+)"} (\d+)/g;
  let match;
  const loop = true;
  const items: { [key: string]: any } = {};

  while (loop) {
    match = regex.exec(text);
    if (match === null) break;

    const [_, tmdbFullId, providerId, title, success, count] = match;
    if (items[tmdbFullId]) {
      items[tmdbFullId].count += parseInt(count, 10);
    } else {
      items[tmdbFullId] = {
        tmdbFullId,
        providerId,
        title,
        success: success === "true",
        count: parseInt(count, 10),
      };
    }
  }

  if (Object.keys(items).length > 0) {
    return Object.values(items);
  }
  throw new Error("RECENT_PLAYED_ITEMS not found");
}

async function getTotalViews() {
  const response = await fetch("https://backend.sudo-flix.lol/metrics");
  const text = await response.text();

  // Add up all mw_media_watch_count entries
  const regex = /mw_media_watch_count{[^}]*} (\d+)/g;
  let totalViews = 0;
  let match = regex.exec(text);

  while (match !== null) {
    totalViews += parseInt(match[1], 10);
    match = regex.exec(text);
  }

  if (totalViews > 0) {
    return totalViews.toString();
  }
  throw new Error("TOTAL_VIEWS not found");
}

export function TopFlix() {
  const [recentPlayedItems, setRecentPlayedItems] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const maxItemsToShow = 12; // Maximum items to show

  useEffect(() => {
    getRecentPlayedItems()
      .then((items) => {
        // Limit the items to the first 100 to ensure we don't exceed the max page count
        const limitedItems = items
          .slice(0, maxItemsToShow)
          .filter(
            (item, index, self) =>
              index ===
              self.findIndex((t2) => t2.tmdbFullId === item.tmdbFullId),
          );

        setRecentPlayedItems(limitedItems);
      })
      .catch((error) => {
        console.error("Error fetching recent played items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    getTotalViews()
      .then((views) => {
        setTotalViews(views);
      })
      .catch((error) => {
        console.error("Error fetching total views:", error);
      });
  }, []);

  function getItemsForCurrentPage() {
    const sortedItems = recentPlayedItems.sort((a, b) => b.count - a.count);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedItems.slice(startIndex, endIndex);
  }

  if (loading) {
    return (
      <p className="flex items-center justify-center h-screen">Loading...</p>
    );
  }

  // make a object named media and it should be of type MediaItem

  return (
    <SubPageLayout>
      <ThiccContainer>
        <div className="mt-8 w-full px-8">
          <Heading1>Top flix</Heading1>
          <Paragraph className="mb-18">
            The most popular movies on sudo-flix.lol, this data is fetched from
            the current backend deployment.
          </Paragraph>
          <div className="mt-8 w-auto">
            <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-14 inline-block">
              <p className="font-bold bg-opacity-90 text-buttons-secondaryText">
                Overall Views: {totalViews}
              </p>
            </div>
          </div>

          <MediaGrid>
            {getItemsForCurrentPage().map((item) => {
              const tmdbId = item.tmdbFullId.split("-")[1];
              const type = isShowOrMovie(item.tmdbFullId);
              // const poster = await getPoster(tmdbId, type === "movie" ? TMDBContentTypes.MOVIE : TMDBContentTypes.TV);
              const poster = "";
              const media: MediaItem = {
                id: tmdbId,
                title: item.title,
                type,
                poster,
                // year: 420,
              };

              return <MediaCard linkable media={media} />;
            })}
          </MediaGrid>
        </div>
      </ThiccContainer>
    </SubPageLayout>
  );
}
