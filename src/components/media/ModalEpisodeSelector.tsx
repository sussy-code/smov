import React, { useEffect, useState } from "react";

import { get } from "@/backend/metadata/tmdb";
import { conf } from "@/setup/config";

interface ModalEpisodeSelectorProps {
  tmdbId: string;
}

export function EpisodeSelector({ tmdbId }: ModalEpisodeSelectorProps) {
  const [seasonsData, setSeasonsData] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<any>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const showDetails = await get<any>(`/tv/${tmdbId}`, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });
        setSeasonsData(showDetails.seasons);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeasons();
  }, [tmdbId]);

  const handleSeasonSelect = async (season: any) => {
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
  };

  return (
    <div className="flex p-2 mt-4 bg-mediaCard-hoverBackground rounded max-h-48 overflow-hidden">
      <div className="flex-none w-20 overflow-y-auto max-h-48">
        {seasonsData.map((season) => (
          <div
            key={season.season_number}
            onClick={() => handleSeasonSelect(season)}
            className="cursor-pointer hover:bg-search-background p-1 text-center rounded"
          >
            S{season.season_number}
          </div>
        ))}
      </div>
      <div className="flex-auto p-2 overflow-y-auto max-h-96">
        {selectedSeason ? (
          <div>
            <h2>
              {selectedSeason.name} - {selectedSeason.episodes.length} episodes
            </h2>
            <ul>
              {selectedSeason.episodes.map(
                (
                  episode: { episode_number: number; name: string },
                  index: number,
                ) => (
                  <li key={episode.episode_number}>
                    {episode.episode_number}. {episode.name}
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : (
          <div>
            <p>Select a season to see details</p>
          </div>
        )}
      </div>
    </div>
  );
}
