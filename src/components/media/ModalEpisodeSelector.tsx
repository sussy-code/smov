import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { get } from "@/backend/metadata/tmdb";
import { Flare } from "@/components/utils/Flare";
import { conf } from "@/setup/config";

interface ModalEpisodeSelectorProps {
  tmdbId: string;
  mediaTitle: string;
}

export function EpisodeSelector({
  tmdbId,
  mediaTitle,
}: ModalEpisodeSelectorProps) {
  const [seasonsData, setSeasonsData] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const navigate = useNavigate();

  const handleSeasonSelect = useCallback(
    async (season: any) => {
      try {
        const seasonDetails = await get<any>(
          `/tv/${tmdbId}/season/${season.season_number}`,
          {
            api_key: conf().TMDB_READ_API_KEY,
            language: "en-US",
          },
        );
        // console.log("Fetched season details:", seasonDetails);
        setSelectedSeason(seasonDetails);
      } catch (err) {
        console.error(err);
      }
    },
    [tmdbId],
  );

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const showDetails = await get<any>(`/tv/${tmdbId}`, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });
        // console.log("Fetched show details:", showDetails);
        setSeasonsData(showDetails.seasons);
        if (showDetails.seasons[0] === 0) {
          // Default to first season
          handleSeasonSelect(showDetails.seasons[0]);
        } else {
          handleSeasonSelect(showDetails.seasons[1]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeasons();
  }, [handleSeasonSelect, tmdbId]);

  return (
    <div className="flex flex-row relative">
      <div className="w-24 min-w-20 cursor-pointer overflow-y-auto overflow-x-hidden max-h-56 z-10 scrollbar-hide">
        {seasonsData.map((season) => (
          <div
            key={season.season_number}
            onClick={() => handleSeasonSelect(season)}
            className={`cursor-pointer p-1 text-center rounded transition-transform duration-200 ${
              selectedSeason &&
              season.season_number === selectedSeason.season_number
                ? "bg-search-background"
                : "hover:bg-search-background hover:scale-95"
            }`}
          >
            {season.season_number !== 0
              ? `S${season.season_number}`
              : `Specials`}
          </div>
        ))}
      </div>
      <div className="flex-auto sm:mt-0 sm:ml-4 cursor-pointer overflow-x-auto overflow-y-hidden sm:overflow-y-auto sm:overflow-x-hidden max-h-56 max-w-[70vw]">
        <div className="flex sm:grid sm:grid-cols-3 sm:gap-2 gap-1">
          {selectedSeason ? (
            selectedSeason.episodes.map(
              (episode: {
                episode_number: number;
                name: string;
                still_path: string;
                id: string;
              }) => (
                <Flare.Base
                  key={episode.episode_number}
                  onClick={() => {
                    navigate(
                      `/media/tmdb-tv-${tmdbId}-${mediaTitle}/${selectedSeason.id}/${episode.id}`,
                    );
                  }}
                  className="group cursor-pointer rounded-xl relative p-[0.6em] bg-background-secondary transition-colors duration-[0.25s] flex-shrink-0 w-44 max-h-48 sm:w-auto mr-2 sm:mr-0"
                >
                  <Flare.Light
                    flareSize={300}
                    cssColorVar="--colors-mediaCard-hoverAccent"
                    backgroundClass="bg-mediaCard-hoverBackground duration-200"
                    className="rounded-xl bg-background-main group-hover:opacity-100"
                  />
                  <div className="relative z-10">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}
                      className="w-full h-auto rounded"
                    />
                    <div className="text-center my-2 overflow-hidden">
                      <p className="text-[0.95em] overflow-ellipsis whitespace-wrap">
                        E{episode.episode_number}: {episode.name}
                      </p>
                    </div>
                  </div>
                </Flare.Base>
              ),
            )
          ) : (
            <div className="text-center w-full">
              Select a season to see episodes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
