import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import { ThiccContainer } from "@/components/layout/ThinContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Paragraph } from "@/components/utils/Text";

import { SubPageLayout } from "./layouts/SubPageLayout";
// import { MediaGrid } from "@/components/media/MediaGrid"
// import { TopFlixCard } from "@/components/media/FlixCard";

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

function isShowOrMovie(tmdbFullId: string): "series" | "movie" | "unknown" {
  if (tmdbFullId.includes("show-")) {
    return "series";
  }
  if (tmdbFullId.includes("movie-")) {
    return "movie";
  }
  return "unknown";
}

function directLinkToContent(tmdbFullId: string) {
  if (isShowOrMovie(tmdbFullId) === "series") {
    return `/media/tmdb-tv-${tmdbFullId.split("-")[1]}#/media/tmdb-tv-${
      tmdbFullId.split("-")[1]
    }`;
  }
  if (isShowOrMovie(tmdbFullId) === "movie") {
    return `/media/tmdb-movie-${tmdbFullId.split("-")[1]}#/media/tmdb-movie-${
      tmdbFullId.split("-")[1]
    }`;
  }
  return null;
}

function ConfigValue(props: {
  name: string;
  type: string;
  id: string;
  children?: ReactNode;
}) {
  const link = directLinkToContent(props.id);
  return (
    <>
      <div className="flex">
        <p className="flex-1 font-bold text-white pr-5 pl-3">
          {link ? (
            <Link to={link} className="hover:underline">
              {props.name}
            </Link>
          ) : (
            <p>{props.name}</p>
          )}
        </p>
        <p className="pr-3">{props.children}</p>
      </div>
      <p className="pr-5 pl-3">
        {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
      </p>
      <Divider marginClass="my-3" />
    </>
  );
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

function getProcessStartTime(): Promise<string> {
  return fetch("https://backend.sudo-flix.lol/metrics")
    .then((response) => response.text())
    .then((text) => {
      const regex = /process_start_time_seconds (\d+)/;
      const match = text.match(regex);

      if (match) {
        const parsedNum = parseInt(match[1], 10);
        const date = new Date(parsedNum * 1000);
        return date.toISOString();
      }
      throw new Error("PROCESS_START_TIME_SECONDS not found");
    });
}

async function getTimeSinceProcessStart(): Promise<string> {
  const processStartTime = await getProcessStartTime();
  const currentTime = new Date();
  const timeDifference =
    currentTime.getTime() - new Date(processStartTime).getTime();

  // Convert the time difference to a human-readable format
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}:${minutes} hours`;
  }
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return `${seconds} seconds`;
}

export function TopFlix() {
  const [recentPlayedItems, setRecentPlayedItems] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxItemsToShow = 100; // Maximum items to show
  const maxPageCount = Math.ceil(maxItemsToShow / itemsPerPage); // Calculate max page count based on maxItemsToShow
  const [timeSinceProcessStart, setTimeSinceProcessStart] = useState<
    string | null
  >(null);

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

  useEffect(() => {
    getTimeSinceProcessStart()
      .then((time) => {
        setTimeSinceProcessStart(time);
      })
      .catch((error) => {
        console.error("Error fetching time since process start:", error);
      });
  }, []);

  function getItemsForCurrentPage() {
    const sortedItems = recentPlayedItems.sort((a, b) => b.count - a.count);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return sortedItems.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      rank: startIndex + index + 1,
    }));
  }

  if (loading) {
    return (
      <p className="flex items-center justify-center h-screen">Loading...</p>
    );
  }

  return (
    <SubPageLayout>
      <ThiccContainer>
        <div className="mt-8 w-full px-8">
          <Heading1>Top flix</Heading1>
          <Paragraph className="mb-6">
            The most popular movies on sudo-flix.lol, this data is fetched from
            the current backend deployment.
          </Paragraph>
          <div className="mt-8 flex-col gap-2 w-auto">
            <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-2 inline-block">
              <p className="font-bold bg-opacity-90 text-buttons-secondaryText">
                Server Lifetime: {timeSinceProcessStart}
              </p>
            </div>
            <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-2 inline-block">
              <p className="font-bold bg-opacity-90 text-buttons-secondaryText">
                Overall Views: {totalViews}
              </p>
            </div>
          </div>
        </div>

        <div className="pl-6 pr-6">
          <Divider marginClass="my-3" />
          {getItemsForCurrentPage().map((item) => {
            return (
              <ConfigValue
                key={item.tmdbFullId}
                type={isShowOrMovie(item.tmdbFullId)}
                id={item.tmdbFullId}
                name={item.title}
              >
                {`${
                  item.providerId.charAt(0).toUpperCase() +
                  item.providerId.slice(1)
                }`}{" "}
                <strong>-</strong> {`Views: `}
                <strong>{item.count}</strong>
              </ConfigValue>
            );
          })}
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="mt-5 w-full px-8"
        >
          <Button
            className="py-px box-content bg-buttons-secondary hover:bg-buttons-secondaryHover bg-opacity-90 text-buttons-secondaryText justify-center items-center"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous page
          </Button>
          <div style={{ display: "flex", alignItems: "center" }}>
            {currentPage}/{maxPageCount}
          </div>
          <Button
            className="py-px box-content bg-buttons-secondary hover:bg-buttons-secondaryHover bg-opacity-90 text-buttons-secondaryText justify-center items-center"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === maxPageCount}
          >
            Next page
          </Button>
        </div>
      </ThiccContainer>
    </SubPageLayout>
  );
}
