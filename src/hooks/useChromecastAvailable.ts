/// <reference types="chromecast-caf-sender"/>

import { useEffect, useRef, useState } from "react";

import { isChromecastAvailable } from "@/setup/chromecast";

export function useChromecastAvailable() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    isChromecastAvailable((bool) => setAvailable(bool));
  }, []);

  return available;
}

export function useChromecast() {
  const available = useChromecastAvailable();
  const instance = useRef<cast.framework.CastContext | null>(null);
  const remotePlayerController =
    useRef<cast.framework.RemotePlayerController | null>(null);

  function startCast() {
    const movieMeta = new chrome.cast.media.MovieMediaMetadata();
    movieMeta.title = "Big Buck Bunny";

    const mediaInfo = new chrome.cast.media.MediaInfo("hello", "video/mp4");
    (mediaInfo as any).contentUrl =
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
    mediaInfo.metadata = movieMeta;

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;

    const session = instance.current?.getCurrentSession();
    console.log("testing", session);
    if (!session) return;

    session
      .loadMedia(request)
      .then(() => {
        console.log("Media is loaded");
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  function stopCast() {
    const session = instance.current?.getCurrentSession();
    if (!session) return;

    const controller = remotePlayerController.current;
    if (!controller) return;
    controller.stop();
  }

  useEffect(() => {
    if (!available) return;

    // setup instance if not already
    if (!instance.current) {
      const ins = cast.framework.CastContext.getInstance();
      ins.setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
      });
      instance.current = ins;
    }

    // setup player if not already
    if (!remotePlayerController.current) {
      const player = new cast.framework.RemotePlayer();
      const controller = new cast.framework.RemotePlayerController(player);
      remotePlayerController.current = controller;
    }

    // setup event listener
    function listenToEvents(e: cast.framework.RemotePlayerChangedEvent) {
      console.log("chromecast event", e);
    }
    function connectionChanged(e: cast.framework.RemotePlayerChangedEvent) {
      console.log("chromecast event connection changed", e);
    }
    remotePlayerController.current.addEventListener(
      cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
      listenToEvents
    );
    remotePlayerController.current.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      connectionChanged
    );

    return () => {
      remotePlayerController.current?.removeEventListener(
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        listenToEvents
      );
      remotePlayerController.current?.removeEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        connectionChanged
      );
    };
  }, [available]);

  return {
    startCast,
    stopCast,
  };
}
