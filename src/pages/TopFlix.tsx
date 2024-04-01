import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import Link from react-router-dom

import { ThiccContainer } from "@/components/layout/ThinContainer";
import { Divider } from "@/components/utils/Divider";
import { Heading1, Paragraph } from "@/components/utils/Text";
import { BACKEND_URL } from "@/setup/constants";

import { SubPageLayout } from "./layouts/SubPageLayout";
import { PageTitle } from "./parts/util/PageTitle";

export function Button(props: {
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
    return `/media/tmdb-tv-${tmdbFullId.split("-")[1]}`;
  }
  if (isShowOrMovie(tmdbFullId) === "movie") {
    return `/media/tmdb-movie-${tmdbFullId.split("-")[1]}`;
  }
  return null;
}

function ConfigValue(props: {
  name: string;
  type: string;
  id: string;
  children?: ReactNode;
}) {
  const navigate = useNavigate();
  const link = directLinkToContent(props.id);
  return (
    <>
      <div className="flex">
        <p className="flex-1 font-bold text-white pr-5 pl-3">
          {link ? (
            <p
              onClick={() => navigate(link)}
              className="transition duration-200 hover:underline cursor-pointer"
            >
              {props.name}
            </p>
          ) : (
            <p>{props.name}</p>
          )}
        </p>
        <p className="pr-3 cursor-default">{props.children}</p>
      </div>
      <p className="pr-5 pl-3 cursor-default">
        {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
      </p>
      <Divider marginClass="my-3" />
    </>
  );
}

async function getRecentPlayedItems() {
  const response = await fetch(BACKEND_URL);
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
  const response = await fetch(BACKEND_URL);
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
  return fetch(BACKEND_URL)
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

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (days > 0) {
    if (days === 1) {
      return `${days} day`;
    }
    return `${days} days`;
  }
  if (hours > 0) {
    return `${hours} hours`;
  }
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return `${seconds} seconds`;
}

export function TopFlix() {
  const [recentPlayedItems, setRecentPlayedItems] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxItemsToShow = 100; // Maximum items to show
  const maxPageCount = Math.ceil(maxItemsToShow / itemsPerPage); // Calculate max page count based on maxItemsToShow
  const [timeSinceProcessStart, setTimeSinceProcessStart] = useState<
    string | null
  >(null);
  const navigate = useNavigate();

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
      });
    getTotalViews()
      .then((views) => {
        setTotalViews(parseInt(views, 10).toLocaleString());
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

  return (
    <SubPageLayout>
      <ThiccContainer>
        <PageTitle subpage k="global.pages.topFlix" />
        <div className="mt-8 w-full px-8 cursor-default">
          <Heading1>Top flix</Heading1>
          <Paragraph className="mb-6">
            The top 100 most-watched movies on sudo-flix.lol, sourced directly
            from the most recent sudo-backend deployment. The backend is
            redeployed frequently which may result in low numbers being shown
            here.
          </Paragraph>
          <div className="mt-2 w-full">
            <div className="flex justify-center">
              <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-2">
                <p className="font-bold text-buttons-secondaryText">
                  Server Lifetime: {timeSinceProcessStart}
                </p>
              </div>
              <div className="bg-buttons-secondary rounded-xl scale-95 py-3 px-5 mb-2">
                <p className="font-bold text-buttons-secondaryText">
                  Overall Views: {totalViews}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                className="py-px w-60 box-content bg-buttons-secondary hover:bg-buttons-secondaryHover bg-opacity-90 text-buttons-secondaryText justify-center items-center inline-block"
                onClick={() => navigate("/flix/sources")}
              >
                Most used providers
              </Button>
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
                <strong>{parseInt(item.count, 10).toLocaleString()}</strong>
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
            onClick={() =>
              setCurrentPage(currentPage === 1 ? maxPageCount : currentPage - 1)
            }
          >
            Previous page
          </Button>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "default" }}
          >
            {currentPage}/{maxPageCount}
          </div>
          <Button
            className="py-px box-content bg-buttons-secondary hover:bg-buttons-secondaryHover bg-opacity-90 text-buttons-secondaryText justify-center items-center"
            onClick={() =>
              setCurrentPage(currentPage === maxPageCount ? 1 : currentPage + 1)
            }
          >
            Next page
          </Button>
        </div>
      </ThiccContainer>
    </SubPageLayout>
  );
}
