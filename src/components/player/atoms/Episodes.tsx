import classNames from "classnames";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import { getMetaFromId } from "@/backend/metadata/getmeta";
import { MWMediaType, MWSeasonMeta } from "@/backend/metadata/types/mw";
import { Icons } from "@/components/Icon";
import { ProgressRing } from "@/components/layout/ProgressRing";
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
import { useProgressStore } from "@/stores/progress";

import { hasAired } from "../utils/aired";

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
  const { t } = useTranslation();
  const meta = usePlayerStore((s) => s.meta);
  const [loadingState, seasons] = useSeasonData(
    meta?.tmdbId ?? "",
    selectedSeason,
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
    content = (
      <CenteredText>{t("player.menus.episodes.loadingError")}</CenteredText>
    );
  else if (loadingState.loading)
    content = (
      <CenteredText>{t("player.menus.episodes.loadingList")}</CenteredText>
    );

  return (
    <Menu.CardWithScrollable>
      <Menu.Title>
        {meta?.title ?? t("player.menus.episodes.loadingTitle")}
      </Menu.Title>
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
  const progress = useProgressStore();

  const playEpisode = useCallback(
    (episodeId: string) => {
      if (loadingState.value) {
        const newData = setPlayerMeta(loadingState.value.fullData, episodeId);
        if (newData) onChange?.(newData);
      }
      // prevent router clear here, otherwise its done double
      // player already switches route after meta change
      router.close(true);
    },
    [setPlayerMeta, loadingState, router, onChange],
  );

  if (!meta?.tmdbId) return null;

  let content: ReactNode = null;
  if (loadingState.error)
    content = (
      <CenteredText>{t("player.menus.episodes.loadingError")}</CenteredText>
    );
  else if (loadingState.loading)
    content = (
      <CenteredText>{t("player.menus.episodes.loadingList")}</CenteredText>
    );
  else if (loadingState.value) {
    const hasUnairedEpisodes = loadingState.value.season.episodes.some(
      (ep) => !hasAired(ep.air_date),
    );
    content = (
      <Menu.ScrollToActiveSection className="pb-6">
        {loadingState.value.season.episodes.length === 0 ? (
          <Menu.TextDisplay title="No episodes found">
            {t("player.menus.episodes.emptyState")}
          </Menu.TextDisplay>
        ) : null}
        {loadingState.value.season.episodes.map((ep) => {
          const episodeProgress =
            progress.items[meta?.tmdbId]?.episodes?.[ep.id];

          let rightSide;
          if (episodeProgress) {
            const percentage =
              (episodeProgress.progress.watched /
                episodeProgress.progress.duration) *
              100;
            rightSide = (
              <ProgressRing
                className="h-[18px] w-[18px] text-white"
                percentage={percentage > 90 ? 100 : percentage}
              />
            );
          }

          return (
            <Menu.Link
              key={ep.id}
              onClick={() => playEpisode(ep.id)}
              active={ep.id === meta?.episode?.tmdbId}
              clickable={hasAired(ep.air_date)}
              rightSide={rightSide}
            >
              <Menu.LinkTitle>
                <div
                  className={classNames(
                    "text-left flex items-center space-x-3 text-video-context-type-main",
                    hasAired(ep.air_date) || ep.id === meta?.episode?.tmdbId
                      ? ""
                      : "text-opacity-25",
                  )}
                >
                  <span
                    className={classNames(
                      "p-0.5 px-2 rounded inline bg-video-context-hoverColor",
                      ep.id === meta?.episode?.tmdbId
                        ? "text-white bg-opacity-100"
                        : "bg-opacity-50",
                      hasAired(ep.air_date) || ep.id === meta?.episode?.tmdbId
                        ? ""
                        : "!bg-opacity-25",
                    )}
                  >
                    {t("player.menus.episodes.episodeBadge", {
                      episode: ep.number,
                    })}
                  </span>
                  <span className="line-clamp-1 break-all">{ep.title}</span>
                </div>
              </Menu.LinkTitle>
            </Menu.Link>
          );
        })}
        {hasUnairedEpisodes ? (
          <p>{t("player.menus.episodes.unairedEpisodes")}</p>
        ) : null}
      </Menu.ScrollToActiveSection>
    );
  }

  return (
    <Menu.CardWithScrollable>
      <Menu.BackLink
        onClick={goBack}
        rightSide={
          <span>
            {loadingState?.value?.season.title ||
              t("player.menus.episodes.loadingTitle")}
          </span>
        }
      >
        {t("player.menus.episodes.seasons")}
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
  const [selectedSeason, setSelectedSeason] = useState("");

  const lastActiveState = useRef(false);
  useEffect(() => {
    if (lastActiveState.current === router.isRouterActive) return;
    lastActiveState.current = router.isRouterActive;
    setSelectedSeason(meta?.season?.tmdbId ?? "");
  }, [meta, selectedSeason, setSelectedSeason, router.isRouterActive]);

  const setSeason = useCallback(
    (seasonId: string) => {
      setSelectedSeason(seasonId);
      router.navigate("/episodes");
    },
    [router],
  );

  return (
    <Overlay id={id}>
      <OverlayRouter id={id}>
        <OverlayPage id={id} path="/" width={343} height={431}>
          <SeasonsView setSeason={setSeason} selectedSeason={selectedSeason} />
        </OverlayPage>
        <OverlayPage id={id} path="/episodes" width={343} height={431}>
          {selectedSeason.length > 0 ? (
            <EpisodesView
              selectedSeason={selectedSeason}
              id={id}
              goBack={() => router.navigate("/")}
              onChange={onChange}
            />
          ) : null}
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
        {t("player.menus.episodes.button")}
      </VideoPlayerButton>
    </OverlayAnchor>
  );
}
