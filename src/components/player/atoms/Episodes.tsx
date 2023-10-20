import { ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import { getMetaFromId } from "@/backend/metadata/getmeta";
import { MWMediaType, MWSeasonMeta } from "@/backend/metadata/types/mw";
import { Icons } from "@/components/Icon";
import { OverlayAnchor } from "@/components/overlays/OverlayAnchor";
import { Overlay } from "@/components/overlays/OverlayDisplay";
import { OverlayPage } from "@/components/overlays/OverlayPage";
import { OverlayRouter } from "@/components/overlays/OverlayRouter";
import { usePlayerMeta } from "@/components/player/hooks/usePlayerMeta";
import { VideoPlayerButton } from "@/components/player/internals/Button";
import { Menu } from "@/components/player/internals/ContextMenu";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { PlayerMeta } from "@/stores/player/slices/source";
import { usePlayerStore } from "@/stores/player/store";

function CenteredText(props: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex justify-center items-center p-8 text-center">
      {props.children}
    </div>
  );
}

function useSeasonData(mediaId: string, seasonId: string) {
  const [seasons, setSeason] = useState<MWSeasonMeta[] | null>(null);

  const state = useAsync(async () => {
    const data = await getMetaFromId(MWMediaType.SERIES, mediaId, seasonId);
    if (data?.meta.type !== MWMediaType.SERIES) return null;
    setSeason(data.meta.seasons);
    return {
      season: data.meta.seasonData,
      fullData: data,
    };
  }, [mediaId, seasonId]);

  return [state, seasons] as const;
}

function SeasonsView({
  selectedSeason,
  setSeason,
}: {
  selectedSeason: string;
  setSeason: (id: string) => void;
}) {
  const meta = usePlayerStore((s) => s.meta);
  const [loadingState, seasons] = useSeasonData(
    meta?.tmdbId ?? "",
    selectedSeason
  );

  let content: ReactNode = null;
  if (seasons) {
    content = (
      <Menu.Section className="pb-6">
        {seasons?.map((season) => {
          return (
            <Menu.ChevronLink
              key={season.id}
              onClick={() => setSeason(season.id)}
            >
              {season.title}
            </Menu.ChevronLink>
          );
        })}
      </Menu.Section>
    );
  } else if (loadingState.error)
    content = <CenteredText>Error loading season</CenteredText>;
  else if (loadingState.loading)
    content = <CenteredText>Loading...</CenteredText>;

  return (
    <Menu.CardWithScrollable>
      <Menu.Title>{meta?.title}</Menu.Title>
      {content}
    </Menu.CardWithScrollable>
  );
}

function EpisodesView({
  id,
  selectedSeason,
  goBack,
  onChange,
}: {
  id: string;
  selectedSeason: string;
  goBack?: () => void;
  onChange?: (meta: PlayerMeta) => void;
}) {
  const { t } = useTranslation();
  const router = useOverlayRouter(id);
  const { setPlayerMeta } = usePlayerMeta();
  const meta = usePlayerStore((s) => s.meta);
  const [loadingState] = useSeasonData(meta?.tmdbId ?? "", selectedSeason);

  const playEpisode = useCallback(
    (episodeId: string) => {
      if (loadingState.value) {
        const newData = setPlayerMeta(loadingState.value.fullData, episodeId);
        if (newData) onChange?.(newData);
      }
      router.close();
    },
    [setPlayerMeta, loadingState, router, onChange]
  );

  let content: ReactNode = null;
  if (loadingState.error)
    content = <CenteredText>Error loading season</CenteredText>;
  else if (loadingState.loading)
    content = <CenteredText>Loading...</CenteredText>;
  else if (loadingState.value) {
    content = (
      <Menu.Section className="pb-6">
        {loadingState.value.season.episodes.length === 0 ? (
          <Menu.TextDisplay title="No episodes found">
            There are no episodes in this season, check back later!
          </Menu.TextDisplay>
        ) : null}
        {loadingState.value.season.episodes.map((ep) => {
          return (
            <Menu.ChevronLink
              key={ep.id}
              onClick={() => playEpisode(ep.id)}
              active={ep.id === meta?.episode?.tmdbId}
            >
              <Menu.LinkTitle>
                <div className="text-left flex items-center space-x-3">
                  <span className="p-0.5 px-2 rounded inline bg-video-context-border">
                    E{ep.number}
                  </span>
                  <span className="line-clamp-1 break-all">{ep.title}</span>
                </div>
              </Menu.LinkTitle>
            </Menu.ChevronLink>
          );
        })}
      </Menu.Section>
    );
  }

  return (
    <Menu.CardWithScrollable>
      <Menu.BackLink onClick={goBack}>
        {loadingState?.value?.season.title || t("videoPlayer.loading")}
      </Menu.BackLink>
      {content}
    </Menu.CardWithScrollable>
  );
}

function EpisodesOverlay({
  id,
  onChange,
}: {
  id: string;
  onChange?: (meta: PlayerMeta) => void;
}) {
  const router = useOverlayRouter(id);
  const meta = usePlayerStore((s) => s.meta);
  const [selectedSeason, setSelectedSeason] = useState(
    meta?.season?.tmdbId ?? ""
  );

  const setSeason = useCallback(
    (seasonId: string) => {
      setSelectedSeason(seasonId);
      router.navigate("/episodes");
    },
    [router]
  );

  return (
    <Overlay id={id}>
      <OverlayRouter id={id}>
        <OverlayPage id={id} path="/" width={343} height={431}>
          <SeasonsView setSeason={setSeason} selectedSeason={selectedSeason} />
        </OverlayPage>
        <OverlayPage id={id} path="/episodes" width={343} height={431}>
          <EpisodesView
            selectedSeason={selectedSeason}
            id={id}
            goBack={() => router.navigate("/")}
            onChange={onChange}
          />
        </OverlayPage>
      </OverlayRouter>
    </Overlay>
  );
}

interface EpisodesProps {
  onChange?: (meta: PlayerMeta) => void;
}

export function EpisodesRouter(props: EpisodesProps) {
  return <EpisodesOverlay onChange={props.onChange} id="episodes" />;
}

export function Episodes() {
  const { t } = useTranslation();
  const router = useOverlayRouter("episodes");
  const setHasOpenOverlay = usePlayerStore((s) => s.setHasOpenOverlay);
  const type = usePlayerStore((s) => s.meta?.type);

  useEffect(() => {
    setHasOpenOverlay(router.isRouterActive);
  }, [setHasOpenOverlay, router.isRouterActive]);
  if (type !== "show") return null;

  return (
    <OverlayAnchor id={router.id}>
      <VideoPlayerButton
        onClick={() => router.open("/episodes")}
        icon={Icons.EPISODES}
      >
        {t("videoPlayer.buttons.episodes")}
      </VideoPlayerButton>
    </OverlayAnchor>
  );
}
