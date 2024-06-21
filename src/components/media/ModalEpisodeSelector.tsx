import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { get } from "@/backend/metadata/tmdb";
import { Flare } from "@/components/utils/Flare";
import { conf } from "@/setup/config";

interface ModalEpisodeSelectorProps {
  tmdbId: string;
  mediaTitle: string;
}

interface Season {
  season_number: number;
  id: number;
}

interface ShowDetails {
  seasons: Season[];
}

export function EpisodeSelector({
  tmdbId,
  mediaTitle,
}: ModalEpisodeSelectorProps) {
  const [seasonsData, setSeasonsData] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const navigate = useNavigate();

  const handleSeasonSelect = useCallback(
    async (season: Season) => {
      try {
        const seasonDetails = await get<any>(
          `/tv/${tmdbId}/season/${season.season_number}`,
          {
            api_key: conf().TMDB_READ_API_KEY,
            language: "en-US",
          },
        );
        setSelectedSeason({
          ...seasonDetails,
          season_number: season.season_number,
          id: season.id,
        });
      } catch (err) {
        console.error(err);
      }
    },
    [tmdbId],
  );

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const showDetails = await get<ShowDetails>(`/tv/${tmdbId}`, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });
        setSeasonsData(showDetails.seasons);
        const regularSeasons = showDetails.seasons.filter(
          (season: Season) => season.season_number > 0,
        );
        if (regularSeasons.length > 0) {
          handleSeasonSelect(regularSeasons[0]);
        } else if (showDetails.seasons.length > 0) {
          handleSeasonSelect(showDetails.seasons[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeasons();
  }, [handleSeasonSelect, tmdbId]);

  return (
    <div className="flex flex-row">
      <div className="sm:w-96 w-96 sm:block cursor-pointer overflow-y-scroll overflow-x-hidden max-h-60 max-w-24">
        {seasonsData.map((season: Season) => (
          <div
            key={season.id}
            onClick={() => handleSeasonSelect(season)}
            className={`cursor-pointer p-1 text-center rounded transition-transform duration-200 ${
              selectedSeason && season.id === selectedSeason.id
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
      <div className="flex-auto mt-4 cursor-pointer sm:mt-0 sm:ml-4 overflow-y-auto overflow-x-hidden max-h-60 order-1 sm:order-2">
        <div className="grid grid-cols-3 gap-2">
          {selectedSeason ? (
            selectedSeason.episodes.map(
              (episode: {
                episode_number: number;
                name: string;
                still_path: string;
                id: number;
              }) => (
                <Flare.Base
                  key={episode.id}
                  onClick={() => {
                    const url = `/media/tmdb-tv-${tmdbId}-${mediaTitle}/${selectedSeason.id}/${episode.id}`;
                    console.log(`Navigating to: ${url}`);
                    console.log(
                      `Season ID: ${selectedSeason.id}, Episode ID: ${episode.id}`,
                    );
                    navigate(url);
                  }}
                  className="group cursor-pointer rounded-xl relative p-[0.65em] bg-background-main transition-colors duration-[0.28s]"
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
                      alt={episode.name}
                    />
                    <p className="text-center text-[0.95em] mt-2">
                      {`S${selectedSeason.season_number}E${episode.episode_number}: ${episode.name}`}
                    </p>
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
