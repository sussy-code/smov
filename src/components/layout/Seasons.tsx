import { Dropdown } from "components/Dropdown";
import { Episode } from "components/media/EpisodeButton";
import { useLoading } from "hooks/useLoading";
import { serializePortableMedia } from "hooks/usePortableMedia";
import {
  convertMediaToPortable,
  MWMedia,
  MWMediaSeasons,
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
  const seasonSelected = props.media.season as number;
  const episodeSelected = props.media.episode as number;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const seasonData = await searchSeasons(props.media);
      setSeasons(seasonData);
    })();
  }, [searchSeasons, props.media]);

  function navigateToSeasonAndEpisode(season: number, episode: number) {
    const newMedia: MWMedia = { ...props.media };
    newMedia.episode = episode;
    newMedia.season = season;
    history.replace(
      `/media/${newMedia.mediaType}/${serializePortableMedia(
        convertMediaToPortable(newMedia)
      )}`
    );
  }

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>error!</p> : null}
      {success && seasons.seasons.length ? (
        <>
          <Dropdown
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            selectedItem={`${seasonSelected}`}
            options={seasons.seasons.map((season) => ({
              id: `${season.seasonNumber}`,
              name: `Season ${season.seasonNumber}`,
            }))}
            setSelectedItem={(id) =>
              navigateToSeasonAndEpisode(
                +id,
                seasons.seasons[+id]?.episodes[0].episodeNumber
              )
            }
          />
          {seasons.seasons[seasonSelected]?.episodes.map((v) => (
            <Episode
              key={v.episodeNumber}
              episodeNumber={v.episodeNumber}
              active={v.episodeNumber === episodeSelected}
              onClick={() =>
                navigateToSeasonAndEpisode(seasonSelected, v.episodeNumber)
              }
            />
          ))}
        </>
      ) : null}
    </>
  );
}
