import React, { useEffect, useState } from 'react';
import { get } from "@/backend/metadata/tmdb";
import { conf } from "@/setup/config";

interface ModalEpisodeSelectorProps {
  tmdbId: string;
}

interface Season {
  season_number: number;
}

export const EpisodeSelector: React.FC<ModalEpisodeSelectorProps> = ({ tmdbId }) => {
  const [seasonsData, setSeasonsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        // Fetch TV show details to get seasons list
        const showDetails = await get<any>(`/tv/${tmdbId}`, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });

        const seasons = showDetails.seasons as Season[];
        const seasonsDetailsPromises = seasons.map(season => 
          get<any>(`/tv/${tmdbId}/season/${season.season_number}`, {
            api_key: conf().TMDB_READ_API_KEY,
            language: "en-US",
          })
        );

        // Fetch details for all seasons concurrently
        const seasonsDetails = await Promise.all(seasonsDetailsPromises);
        setSeasonsData(seasonsDetails);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeasons();
  }, [tmdbId]);

  console.log(seasonsData)
  return (
    <div>
      {seasonsData.map((season, index) => (
        <div key={index}>
          Season {season.season_number}: {season.name}
        </div>
      ))}
    </div>
  );
};