import { useEffect, useRef } from "react";

import { makeVideoElementDisplayInterface } from "@/components/player/display/base";
import { makeChromecastDisplayInterface } from "@/components/player/display/chromecast";
import { useChromecastAvailable } from "@/hooks/useChromecastAvailable";
import { usePlayerStore } from "@/stores/player/store";

export function CastingInternal() {
  const setInstance = usePlayerStore((s) => s.casting.setInstance);
  const setController = usePlayerStore((s) => s.casting.setController);
  const setPlayer = usePlayerStore((s) => s.casting.setPlayer);
  const setIsCasting = usePlayerStore((s) => s.casting.setIsCasting);
  const isCasting = usePlayerStore((s) => s.interface.isCasting);
  const setDisplay = usePlayerStore((s) => s.setDisplay);
  const redisplaySource = usePlayerStore((s) => s.redisplaySource);
  const available = useChromecastAvailable();

  const controller = usePlayerStore((s) => s.casting.controller);
  const player = usePlayerStore((s) => s.casting.player);
  const instance = usePlayerStore((s) => s.casting.instance);

  const dataRef = useRef({
    controller,
    player,
    instance,
  });
  useEffect(() => {
    dataRef.current = {
      controller,
      player,
      instance,
    };
  }, [controller, player, instance]);

  useEffect(() => {
    if (isCasting) {
      if (
        dataRef.current.controller &&
        dataRef.current.instance &&
        dataRef.current.player
      ) {
        const newDisplay = makeChromecastDisplayInterface({
          controller: dataRef.current.controller,
          instance: dataRef.current.instance,
          player: dataRef.current.player,
        });
        setDisplay(newDisplay);
        redisplaySource(0); // TODO right start time
      }
    } else {
      const newDisplay = makeVideoElementDisplayInterface();
      setDisplay(newDisplay);
    }
  }, [isCasting, setDisplay, redisplaySource]);

  useEffect(() => {
    if (!available) return;

    const ins = cast.framework.CastContext.getInstance();
    setInstance(ins);
    ins.setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    const newPlayer = new cast.framework.RemotePlayer();
    setPlayer(newPlayer);
    const newControlller = new cast.framework.RemotePlayerController(newPlayer);
    setController(newControlller);

    function connectionChanged(e: cast.framework.RemotePlayerChangedEvent) {
      if (e.field === "isConnected") {
        setIsCasting(e.value);
      }
    }
    newControlller.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      connectionChanged
    );

    return () => {
      newControlller.removeEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        connectionChanged
      );
    };
  }, [available, setPlayer, setController, setInstance, setIsCasting]);

  return null;
}
