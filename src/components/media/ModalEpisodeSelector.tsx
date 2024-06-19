import React, { useCallback, useEffect, useState } from "react";

import { get } from "@/backend/metadata/tmdb";
import { conf } from "@/setup/config";

interface ModalEpisodeSelectorProps {
  tmdbId: string;
}

export function EpisodeSelector({ tmdbId }: ModalEpisodeSelectorProps) {
  const [seasonsData, setSeasonsData] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);

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
        setSeasonsData(showDetails.seasons);
        handleSeasonSelect(showDetails.seasons[0]); // Default to first season
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeasons();
  }, [handleSeasonSelect, tmdbId]);

  return (
    <div className="flex flex-row">
      <div className="sm:w-96 w-96 sm:block flex-auto cursor-pointer overflow-y-scroll overflow-x-hidden max-h-52 scrollbar-track-gray-300">
        {seasonsData.map((season) => (
          <div
            key={season.season_number}
            onClick={() => handleSeasonSelect(season)}
            className="cursor-pointer hover:bg-search-background p-1 text-center rounded hover:scale-95 transition-transform duration-300"
          >
            S{season.season_number}
          </div>
        ))}
      </div>
      <div className="flex-auto mt-4 cursor-pointer sm:mt-0 sm:ml-4 overflow-y-auto overflow-x-hidden max-h-52 order-1 sm:order-2">
        <div className="grid grid-cols-3 gap-2">
          {selectedSeason ? (
            selectedSeason.episodes.map(
              (episode: {
                episode_number: number;
                name: string;
                still_path: string;
              }) => (
                <div
                  key={episode.episode_number}
                  className="bg-mediaCard-hoverBackground rounded p-2 hover:scale-95 hover:border-purple-500 hover:border-2 transition-all duration-300 relative"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300/${episode.still_path}`}
                    alt={episode.name}
                    className="w-full h-auto rounded"
                  />
                  <p className="text-center mt-2">{episode.name}</p>
                  <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 bg-purple-500 rounded pointer-events-none" />
                </div>
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
