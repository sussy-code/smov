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

    // If not already updating the position state, and the media is loading, queue an update
    if (
      !shouldUpdatePositionState.current &&
      dataRef.current.mediaPlaying.isLoading
    ) {
      shouldUpdatePositionState.current = true;
    }

    // If the user has skipped (or MediaSession desynced) by more than 5 seconds, queue an update
    if (
      Math.abs(dataRef.current.progress.time - lastPlaybackPosition.current) >
        5 &&
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
      updatePositionState(dataRef.current.progress.time);
    }

    lastPlaybackPosition.current = dataRef.current.progress.time;
    navigator.mediaSession.playbackState = dataRef.current.mediaPlaying
      .isPlaying
      ? "playing"
      : "paused";

    navigator.mediaSession.metadata = new MediaMetadata({
      title: dataRef.current.meta?.episode?.title,
      artist: dataRef.current.meta?.title,
      artwork: [
        {
          src: dataRef.current.meta?.poster ?? "",
          sizes: "342x513",
          type: "image/png",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      if (dataRef.current.mediaPlaying.isLoading) return;
      dataRef.current.display?.play();

      navigator.mediaSession.playbackState = "playing";
      updatePositionState(dataRef.current.progress.time);
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (dataRef.current.mediaPlaying.isLoading) return;
      dataRef.current.display?.pause();

      navigator.mediaSession.playbackState = "paused";
      updatePositionState(dataRef.current.progress.time);
    });

    navigator.mediaSession.setActionHandler("seekbackward", (evt) => {
      const skipTime = evt.seekOffset ?? 10;
      dataRef.current.display?.setTime(
        dataRef.current.progress.time - skipTime,
      );
      updatePositionState(dataRef.current.progress.time - skipTime);
    });

    navigator.mediaSession.setActionHandler("seekforward", (evt) => {
      const skipTime = evt.seekOffset ?? 10; // Time to skip in seconds
      dataRef.current.display?.setTime(
        dataRef.current.progress.time + skipTime,
      );
      updatePositionState(dataRef.current.progress.time + skipTime);
    });

    navigator.mediaSession.setActionHandler("seekto", (e) => {
      if (!e.seekTime) return;
      dataRef.current.display?.setTime(e.seekTime);
      updatePositionState(e.seekTime);
    });

    if (dataRef.current.meta?.episode?.number !== 1) {
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
  }, [
    changeEpisode,
    meta,
    setDirectMeta,
    setShouldStartFromBeginning,
    updatePositionState,
  ]);
  return null;
}
