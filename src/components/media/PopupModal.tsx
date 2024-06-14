import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { get } from "@/backend/metadata/tmdb";
import { conf } from "@/setup/config";
import { MediaItem } from "@/utils/mediaTypes";

import { Button } from "../buttons/Button";
import { Icon, Icons } from "../Icon";

interface PopupModalProps {
  isVisible: boolean;
  onClose: () => void;
  playingTitle: {
    id: string;
    type: string;
  };
  media: MediaItem;
}

type StyleState = {
  opacity: number;
  visibility: "visible" | "hidden" | undefined;
};

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export function PopupModal({
  isVisible,
  onClose,
  playingTitle,
  media,
}: PopupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<StyleState>({
    opacity: 0,
    visibility: "hidden",
  });
  const [data, setData] = useState<any>(null);
  const [mediaInfo, setMediaInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      setStyle({ opacity: 1, visibility: "visible" });
    } else {
      setStyle({ opacity: 0, visibility: "hidden" });
    }
  }, [isVisible]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isVisible) return;

      try {
        const mediaTypePath = media.type === "show" ? "tv" : media.type;
        const result = await get<any>(`/${mediaTypePath}/${media.id}`, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });
        setData(result);
        setError(null);
      } catch (err) {
        setError("Failed to fetch media data");
        console.error(err);
      }
    };

    fetchData();
  }, [media.id, media.type, isVisible]);

  useEffect(() => {
    const fetchContentRatingsOrReleaseDates = async () => {
      if (!isVisible || (media.type !== "show" && media.type !== "movie"))
        return;

      try {
        const mediaTypeForAPI = media.type === "show" ? "tv" : media.type;
        const endpointSuffix =
          media.type === "show" ? "content_ratings" : "release_dates";
        const result = await get<any>(
          `/${mediaTypeForAPI}/${media.id}/${endpointSuffix}`,
          {
            api_key: conf().TMDB_READ_API_KEY,
            language: "en-US",
          },
        );
        setMediaInfo(result);
        setError(null);
      } catch (err) {
        setError("Failed to fetch content ratings or release dates");
        console.error(err);
      }
    };

    fetchContentRatingsOrReleaseDates();
  }, [media.id, media.type, isVisible]);

  if (!isVisible && style.visibility === "hidden") return null;

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isTVShow = media.type === "show";
  const usReleaseInfo = mediaInfo?.results?.find(
    (result: any) => result.iso_3166_1 === "US",
  );
  const certifiedReleases =
    usReleaseInfo?.release_dates?.filter((date: any) => date.certification) ||
    [];
  const relevantRelease =
    certifiedReleases.length > 0
      ? certifiedReleases.reduce((prev: any, current: any) =>
          new Date(prev.release_date) > new Date(current.release_date)
            ? prev
            : current,
        )
      : null;
  const displayCertification = relevantRelease
    ? `${relevantRelease.certification}`
    : "Not Rated";

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-100"
      style={{ opacity: style.opacity, visibility: style.visibility }}
    >
      <div
        ref={modalRef}
        className="rounded-xl p-3 m-6 bg-modal-background flex justify-center items-center transition-opacity duration-200 w-full max-w-3xl"
        style={{ opacity: style.opacity }}
      >
        <div className="aspect-w-16 aspect-h-9 w-full">
          <img
            src={`https://image.tmdb.org/t/p/original/${data?.backdrop_path}`}
            className="rounded-xl object-cover w-full h-full"
          />
          <div className="flex pt-3 items-center gap-4">
            <h1 className="relative text-2xl whitespace-normal font-bold text-white">
              {data?.title || data?.name}
            </h1>
            <div className="font-semibold">
              {media.type === "movie" ? (
                <div className="px-2 py-1 bg-search-background rounded">
                  <span>{displayCertification}</span>
                </div>
              ) : (
                <div className="px-2 py-1 bg-search-background rounded">
                  <span>
                    {(() => {
                      mediaInfo?.results?.find(
                        (result: any) => result.iso_3166_1 === "US",
                      );
                      return usReleaseInfo && usReleaseInfo.rating
                        ? usReleaseInfo.rating
                        : "Not Rated";
                    })()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2 font-bold">
              {media.type === "movie" &&
                data?.runtime &&
                formatRuntime(data.runtime)}
              <div>
                {media.type === "movie"
                  ? data?.release_date
                    ? String(data.release_date).split("-")[0]
                    : null
                  : media.type === "show"
                    ? data?.first_air_date
                      ? String(data.first_air_date).split("-")[0]
                      : null
                    : null}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3 pb-3 pt-2">
            <div className="flex items-center space-x-[2px] font-semibold">
              {Array.from({ length: 5 }, (_, index) => {
                return (
                  <span key={index}>
                    {index < Math.round(Number(data?.vote_average) / 2) ? (
                      <Icon icon={Icons.STAR} />
                    ) : (
                      <Icon icon={Icons.STAR_BORDER} />
                    )}
                  </span>
                );
              })}
            </div>
            {data?.genres?.map((genre: { name: string }) => (
              <div
                key={genre.name}
                className="px-2 py-1 bg-mediaCard-hoverBackground rounded hover:bg-search-background cursor-default duration-200 transition-colors"
              >
                {genre.name}
              </div>
            ))}
          </div>
          <p className="relative whitespace-normal font-medium">
            {data?.overview}
          </p>
          <div className="flex justify-center items-center mt-4 mb-1">
            <Button
              theme="purple"
              onClick={() =>
                navigate(
                  `/media/tmdb-${isTVShow ? "tv" : "movie"}-${media.id}-${media.title}`,
                )
              }
              className="text-2xl font-bold hover:bg-purple-700 transition-all duration-[0.3s] hover:scale-105"
            >
              <div className="flex flex-row gap-2 items-center">
                <Icon icon={Icons.PLAY} />
                Watch
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
