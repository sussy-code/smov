import { useCallback, useEffect, useRef } from "react";

import { usePlayerStore } from "@/stores/player/store";

import { usePlayerMeta } from "../hooks/usePlayerMeta";

export function MediaSession() {
  const display = usePlayerStore((s) => s.display);
  const mediaPlaying = usePlayerStore((s) => s.mediaPlaying);
  const meta = usePlayerStore((s) => s.meta);
  const progress = usePlayerStore((s) => s.progress);
  const { setDirectMeta } = usePlayerMeta();
  const setShouldStartFromBeginning = usePlayerStore(
    (s) => s.setShouldStartFromBeginning,
  );

  const shouldUpdatePositionState = useRef(false);
  const lastPlaybackPosition = useRef(0);

  const dataRef = useRef({
    display,
    mediaPlaying,
    progress,
    meta,
  });

  useEffect(() => {
    dataRef.current = {
      display,
      mediaPlaying,
      progress,
      meta,
    };
  }, [display, mediaPlaying, progress, meta]);

  const changeEpisode = useCallback(
    (change: number) => {
      const nextEp = meta?.episodes?.find(
        (v) => v.number === (meta?.episode?.number ?? 0) + change,
      );

      if (!meta || !nextEp) return;
      const metaCopy = { ...meta };
      metaCopy.episode = nextEp;
      setShouldStartFromBeginning(true);
      setDirectMeta(metaCopy);
    },
    [setDirectMeta, meta, setShouldStartFromBeginning],
  );

  const updatePositionState = useCallback((position: number) => {
    // If the updated position needs to be buffered, queue an update
    if (position > dataRef.current.progress.buffered) {
      shouldUpdatePositionState.current = true;
    }
    if (position > dataRef.current.progress.duration) return;

    lastPlaybackPosition.current = dataRef.current.progress.time;
    navigator.mediaSession.setPositionState({
      duration: dataRef.current.progress.duration,
      playbackRate: dataRef.current.mediaPlaying.playbackRate,
      position,
    });
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    // If the media is paused, update the navigator
    if (mediaPlaying.isPaused) {
      navigator.mediaSession.playbackState = "paused";
    } else {
      navigator.mediaSession.playbackState = "playing";
    }
  }, [mediaPlaying.isPaused]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    updatePositionState(dataRef.current.progress.time);
  }, [mediaPlaying.playbackRate, updatePositionState]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    // If not already updating the position state, and the media is loading, queue an update
    if (
      !shouldUpdatePositionState.current &&
      dataRef.current.mediaPlaying.isLoading
    ) {
      shouldUpdatePositionState.current = true;
    }

    // If the user has skipped (or MediaSession desynced) by more than 5 seconds, queue an update
    if (
      Math.abs(progress.time - lastPlaybackPosition.current) >= 5 &&
      !dataRef.current.mediaPlaying.isLoading &&
      !shouldUpdatePositionState.current
    ) {
      shouldUpdatePositionState.current = true;
    }

    // If not loading and the position state is queued, update it
    if (
      shouldUpdatePositionState.current &&
      !dataRef.current.mediaPlaying.isLoading
    ) {
      shouldUpdatePositionState.current = false;
      updatePositionState(progress.time);
    }

    lastPlaybackPosition.current = progress.time;
  }, [updatePositionState, progress.time]);

  useEffect(() => {
    if (
      !("mediaSession" in navigator) ||
      dataRef.current.mediaPlaying.hasPlayedOnce ||
      dataRef.current.progress.duration === 0
    )
      return;

    const title = meta?.episode?.title ?? meta?.title ?? "";
    const artist = meta?.type === "movie" ? undefined : meta?.title ?? "";

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: [
        {
          src: meta?.poster ?? "",
          sizes: "342x513",
          type: "image/png",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      if (dataRef.current.mediaPlaying.isLoading) return;
      dataRef.current.display?.play();

      updatePositionState(dataRef.current.progress.time);
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (dataRef.current.mediaPlaying.isLoading) return;
      dataRef.current.display?.pause();

      updatePositionState(dataRef.current.progress.time);
    });

    navigator.mediaSession.setActionHandler("seekto", (e) => {
      if (!e.seekTime) return;
      dataRef.current.display?.setTime(e.seekTime);
      updatePositionState(e.seekTime);
    });

    if ((dataRef.current.meta?.episode?.number ?? 1) !== 1) {
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        changeEpisode(-1);
      });
    } else {
      navigator.mediaSession.setActionHandler("previoustrack", null);
    }

    if (
      dataRef.current.meta?.episode?.number !==
      dataRef.current.meta?.episodes?.length
    ) {
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        changeEpisode(1);
      });
    } else {
      navigator.mediaSession.setActionHandler("nexttrack", null);
    }
  }, [changeEpisode, updatePositionState, meta]);
  return null;
}
