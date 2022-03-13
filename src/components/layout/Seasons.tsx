import { Dropdown, OptionItem } from "components/Dropdown";
import { WatchedEpisode } from "components/media/WatchedEpisodeButton";
import { useLoading } from "hooks/useLoading";
import { serializePortableMedia } from "hooks/usePortableMedia";
import {
  convertMediaToPortable,
  MWMedia,
  MWMediaSeasons,
  MWMediaSeason,
  MWPortableMedia,
} from "providers";
import { getSeasonDataFromMedia } from "providers/methods/seasons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export interface SeasonsProps {
  media: MWMedia;
}

export function Seasons(props: SeasonsProps) {
  const [searchSeasons, loading, error, success] = useLoading(
    (portableMedia: MWPortableMedia) => getSeasonDataFromMedia(portableMedia)
  );
  const history = useHistory();
  const [seasons, setSeasons] = useState<MWMediaSeasons>({ seasons: [] });
  const seasonSelected = props.media.seasonId as string;
  const episodeSelected = props.media.episodeId as string;

  useEffect(() => {
    (async () => {
      const seasonData = await searchSeasons(props.media);
      setSeasons(seasonData);
    })();
  }, [searchSeasons, props.media]);

  function navigateToSeasonAndEpisode(seasonId: string, episodeId: string) {
    const newMedia: MWMedia = { ...props.media };
    newMedia.episodeId = episodeId;
    newMedia.seasonId = seasonId;
    history.replace(
      `/media/${newMedia.mediaType}/${serializePortableMedia(
        convertMediaToPortable(newMedia)
      )}`
    );
  }

  const mapSeason = (season: MWMediaSeason) => ({
    id: season.id,
    name: season.title || `Season ${season.sort}`,
  });

  const options = seasons.seasons.map(mapSeason);

  const foundSeason = seasons.seasons.find(
    (season) => season.id === seasonSelected
  );
  const selectedItem = foundSeason ? mapSeason(foundSeason) : null;

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>error!</p> : null}
      {success && seasons.seasons.length ? (
        <>
          <Dropdown
            selectedItem={selectedItem as OptionItem}
            options={options}
            setSelectedItem={(seasonItem) =>
              navigateToSeasonAndEpisode(
                seasonItem.id,
                seasons.seasons.find((s) => s.id === seasonItem.id)?.episodes[0]
                  .id as string
              )
            }
          />
          {seasons.seasons
            .find((s) => s.id === seasonSelected)
            ?.episodes.map((v) => (
              <WatchedEpisode
                key={v.id}
                media={{
                  ...props.media,
                  seriesData: seasons,
                  episodeId: v.id,
                  seasonId: seasonSelected,
                }}
                active={v.id === episodeSelected}
                onClick={() => navigateToSeasonAndEpisode(seasonSelected, v.id)}
              />
            ))}
        </>
      ) : null}
    </>
  );
}
