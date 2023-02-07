import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon, Icons } from "@/components/Icon";
import { useLoading } from "@/hooks/useLoading";
import { MWMediaType, MWSeasonWithEpisodeMeta } from "@/backend/metadata/types";
import { getMetaFromId } from "@/backend/metadata/getmeta";
import { decodeJWId } from "@/backend/metadata/justwatch";
import { Loading } from "@/components/layout/Loading";
import { IconPatch } from "@/components/buttons/IconPatch";
import { useVideoPlayerDescriptor } from "@/video/state/hooks";
import { useMeta } from "@/video/state/logic/meta";
import { useControls } from "@/video/state/logic/controls";

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

export function EpisodeSelectionPopout() {
  const params = useParams<{
    media: string;
  }>();
  const descriptor = useVideoPlayerDescriptor();
  const meta = useMeta(descriptor);
  const controls = useControls(descriptor);

  const [isPickingSeason, setIsPickingSeason] = useState<boolean>(false);
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

  const currentSeasonId =
    currentVisibleSeason?.seasonId ?? meta?.episode?.seasonId;

  const setCurrent = useCallback(
    (seasonId: string, episodeId: string) => {
      controls.setCurrentEpisode(seasonId, episodeId);
    },
    [controls]
  );

  const currentSeasonInfo = useMemo(() => {
    return meta?.seasons?.find((season) => season.id === currentSeasonId);
  }, [meta, currentSeasonId]);

  const currentSeasonEpisodes = useMemo(() => {
    if (currentVisibleSeason?.season) {
      return currentVisibleSeason?.season?.episodes;
    }
    return meta?.seasons?.find?.(
      (season) => season && season.id === currentSeasonId
    )?.episodes;
  }, [meta, currentSeasonId, currentVisibleSeason]);

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
              ? meta?.seasons?.map?.((season) => (
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
      <PopupSection className="flex items-center space-x-3 border-b border-denim-500 font-bold text-white">
        <button
          className="-m-1.5 rounded p-1.5 hover:bg-denim-600"
          onClick={toggleIsPickingSeason}
          type="button"
        >
          <Icon icon={Icons.CHEVRON_LEFT} />
        </button>
        <span>{currentSeasonInfo?.title || ""}</span>
      </PopupSection>
      <PopupSection className="h-full overflow-y-auto">
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
                      meta?.episode?.episodeId === e.id &&
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
