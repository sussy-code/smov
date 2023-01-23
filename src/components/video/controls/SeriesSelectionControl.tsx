import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon, Icons } from "@/components/Icon";
import { useLoading } from "@/hooks/useLoading";
import { MWMediaType, MWSeasonWithEpisodeMeta } from "@/backend/metadata/types";
import { getMetaFromId } from "@/backend/metadata/getmeta";
import { decodeJWId } from "@/backend/metadata/justwatch";
import { Loading } from "@/components/layout/Loading";
import { IconPatch } from "@/components/buttons/IconPatch";
import { useVideoPlayerState } from "../VideoContext";
import { VideoPlayerIconButton } from "../parts/VideoPlayerIconButton";

interface Props {
  className?: string;
}

export function PopupThingy(props: {
  children?: React.ReactNode;
  containerClassName?: string;
}) {
  return (
    <div className="absolute inset-x-0 h-0">
      <div className="absolute bottom-10 right-0 h-96 w-72 rounded-lg bg-denim-400">
        <div className={["h-full w-full", props.containerClassName].join(" ")}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

function PopupSection(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["p-4", props.className || ""].join(" ")}>
      {props.children}
    </div>
  );
}

function PopupEpisodeSelect() {
  const params = useParams<{
    media: string;
  }>();
  const { videoState } = useVideoPlayerState();
  const [isPickingSeason, setIsPickingSeason] = useState<boolean>(false);
  const { current, seasons } = videoState.seasonData;
  const [currentVisibleSeason, setCurrentVisibleSeason] = useState<{
    seasonId: string;
    season?: MWSeasonWithEpisodeMeta;
  } | null>(null);
  const [reqSeasonMeta, loading, error] = useLoading(
    (id: string, seasonId: string) => {
      return getMetaFromId(MWMediaType.SERIES, id, seasonId);
    }
  );
  const requestSeason = useCallback(
    (sId: string) => {
      setCurrentVisibleSeason({
        seasonId: sId,
        season: undefined,
      });
      setIsPickingSeason(false);
      reqSeasonMeta(decodeJWId(params.media)?.id as string, sId).then((v) => {
        if (v?.meta.type !== MWMediaType.SERIES) return;
        setCurrentVisibleSeason({
          seasonId: sId,
          season: v?.meta.seasonData,
        });
      });
    },
    [reqSeasonMeta, params.media]
  );

  const currentSeasonId = currentVisibleSeason?.seasonId ?? current?.seasonId;

  const setCurrent = useCallback(
    (seasonId: string, episodeId: string) => {
      videoState.setCurrentEpisode(seasonId, episodeId);
    },
    [videoState]
  );

  const currentSeasonInfo = useMemo(() => {
    return seasons?.find((season) => season.id === currentSeasonId);
  }, [seasons, currentSeasonId]);

  const currentSeasonEpisodes = useMemo(() => {
    if (currentVisibleSeason?.season) {
      return currentVisibleSeason?.season?.episodes;
    }
    return videoState?.seasonData.seasons?.find?.(
      (season) => season && season.id === currentSeasonId
    )?.episodes;
  }, [videoState, currentSeasonId, currentVisibleSeason]);

  const toggleIsPickingSeason = () => {
    setIsPickingSeason(!isPickingSeason);
  };

  const setSeason = (id: string) => {
    requestSeason(id);
    setCurrentVisibleSeason({ seasonId: id });
  };

  if (isPickingSeason)
    return (
      <>
        <PopupSection className="flex items-center space-x-3 border-b border-denim-500 font-bold text-white">
          Pick a season
        </PopupSection>
        <PopupSection className="overflow-y-auto">
          <div className="space-y-1">
            {currentSeasonInfo
              ? videoState?.seasonData?.seasons?.map?.((season) => (
                  <div
                    className="text-denim-800 -mx-2 flex items-center space-x-1 rounded p-2 text-white hover:bg-denim-600"
                    key={season.id}
                    onClick={() => setSeason(season.id)}
                  >
                    {season.title}
                  </div>
                ))
              : "No season"}
          </div>
        </PopupSection>
      </>
    );

  return (
    <>
      <PopupSection className="flex items-center space-x-3 border-b border-denim-600 font-bold text-white">
        <button
          className="-m-1.5 rounded p-1.5 hover:bg-denim-600"
          onClick={toggleIsPickingSeason}
          type="button"
        >
          <Icon icon={Icons.CHEVRON_LEFT} />
        </button>
        <span>{currentSeasonInfo?.title || ""}</span>
      </PopupSection>
      <PopupSection className="overflow-y-auto">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        ) : error ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col flex-wrap items-center text-slate-400">
              <IconPatch
                icon={Icons.EYE_SLASH}
                className="text-xl text-bink-600"
              />
              <p className="mt-6 w-full text-center">
                Something went wrong loading the episodes for{" "}
                {currentSeasonInfo?.title?.toLowerCase()}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {currentSeasonEpisodes && currentSeasonInfo
              ? currentSeasonEpisodes.map((e) => (
                  <div
                    className={[
                      "text-denim-800 -mx-2 flex items-center space-x-1 rounded p-2 text-white hover:bg-denim-600",
                      current?.episodeId === e.id &&
                        "outline outline-2 outline-denim-700",
                    ].join(" ")}
                    onClick={() => setCurrent(currentSeasonInfo.id, e.id)}
                    key={e.id}
                  >
                    {e.number}. {e.title}
                  </div>
                ))
              : "No episodes"}
          </div>
        )}
      </PopupSection>
    </>
  );
}

export function SeriesSelectionControl(props: Props) {
  const { videoState } = useVideoPlayerState();
  const [open, setOpen] = useState(false);

  if (!videoState.seasonData.isSeries) return null;

  return (
    <div className={props.className}>
      <div className="relative">
        {open ? (
          <PopupThingy containerClassName="grid grid-rows-[auto,minmax(0,1fr)]">
            <PopupEpisodeSelect />
          </PopupThingy>
        ) : null}
        <VideoPlayerIconButton
          icon={Icons.EPISODES}
          text="Episodes"
          onClick={() => setOpen((s) => !s)}
        />
      </div>
    </div>
  );
}
